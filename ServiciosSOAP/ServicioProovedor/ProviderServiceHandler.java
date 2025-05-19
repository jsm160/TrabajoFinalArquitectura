package org.provider.control;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ProviderServiceHandler {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecommerce";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "root";

    public boolean makeRestockOrder(int productId, int quantity, int providerId) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                 PreparedStatement ps = connection.prepareStatement(
                     "INSERT INTO restock_orders (product_id, quantity, provider_id) VALUES (?, ?, ?)")) {
                ps.setInt(1, productId);
                ps.setInt(2, quantity);
                ps.setInt(3, providerId);
                return ps.executeUpdate() > 0;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public double checkProductPrice(int productId, int providerId) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                 PreparedStatement ps = connection.prepareStatement(
                     "SELECT price FROM provider_products WHERE product_id = ? AND provider_id = ?")) {
                ps.setInt(1, productId);
                ps.setInt(2, providerId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    return rs.getDouble("price");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return -1.0;
    }
}