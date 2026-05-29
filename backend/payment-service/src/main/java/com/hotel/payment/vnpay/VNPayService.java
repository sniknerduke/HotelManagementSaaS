package com.hotel.payment.vnpay;

import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@ApplicationScoped
public class VNPayService {

    private static final Logger LOG = Logger.getLogger(VNPayService.class);

    @ConfigProperty(name = "vnpay.tmnCode")
    String vnpTmnCode;

    @ConfigProperty(name = "vnpay.hashSecret")
    String vnpHashSecret;

    @ConfigProperty(name = "vnpay.payUrl")
    String vnpPayUrl;


    public String createOrder(java.math.BigDecimal amount, String orderInfor, String urlReturn, String ipAddr, String txnRef) {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = txnRef != null ? txnRef : VNPayUtil.getRandomNumber(8);
        String vnp_IpAddr = (ipAddr != null && !ipAddr.isEmpty()) ? ipAddr : "127.0.0.1";
        String vnp_TmnCode = vnpTmnCode;
        String vnp_OrderType = "other";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        
        // Amount must be multiplied by 100 and formatted as a string with no decimals
        String vnp_Amount = amount.multiply(new java.math.BigDecimal(100)).setScale(0, java.math.RoundingMode.HALF_UP).toString();
        vnp_Params.put("vnp_Amount", vnp_Amount);
        
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", removeAccents(orderInfor));
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", "vn");
        
        vnp_Params.put("vnp_ReturnUrl", urlReturn);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                try {
                    // Build hash data: raw field name + URL-encoded value (matching VNPay official Java code)
                    // IMPORTANT: Do NOT replace "+" with "%20" — VNPay uses + for spaces
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    // Build query string: URL-encoded field name + URL-encoded value
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayUtil.hmacSHA512(vnpHashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHashType=HmacSHA512";
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        
        String paymentUrl = vnpPayUrl + "?" + queryUrl;
        LOG.info("VNPAY Payment URL hash data: " + hashData.toString());
        LOG.info("VNPAY Payment URL: " + paymentUrl);
        return paymentUrl;
    }

    public boolean verifyIPN(Map<String, String> params) {
        LOG.info("Verifying VNPay IPN signature. Received params: " + params);
        Map<String, String> fields = new HashMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String fieldName = entry.getKey();
            String fieldValue = entry.getValue();
            if (fieldName != null && fieldName.startsWith("vnp_") && !fieldName.equals("vnp_SecureHash") && !fieldName.equals("vnp_SecureHashType")) {
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    fields.put(fieldName, fieldValue);
                }
            }
        }
        
        String vnp_SecureHash = params.get("vnp_SecureHash");
        
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && fieldValue.length() > 0) {
                try {
                    // Match VNPay official code: raw field name, URL-encoded value, NO replace("+", "%20")
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        
        String signValue = VNPayUtil.hmacSHA512(vnpHashSecret, hashData.toString());
        boolean isMatch = signValue.equalsIgnoreCase(vnp_SecureHash);
        if (isMatch) {
            LOG.info("VNPay IPN signature verified successfully.");
        } else {
            LOG.error("VNPay IPN signature verification failed!");
            LOG.error("  Reconstructed hashData: " + hashData.toString());
            LOG.error("  Computed signValue: " + signValue);
            LOG.error("  Received vnp_SecureHash: " + vnp_SecureHash);
            LOG.error("  Using vnpHashSecret: " + vnpHashSecret);
        }
        return isMatch;
    }

    private String removeAccents(String str) {
        if (str == null) return "";
        String nfdNormalizedString = java.text.Normalizer.normalize(str, java.text.Normalizer.Form.NFD);
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(nfdNormalizedString).replaceAll("").replace('đ', 'd').replace('Đ', 'D');
    }
}
