package org.stock.control;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class StockServiceHandler {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecommerce";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "root";

    public boolean verifyAvailability(int productId, int quantity) {
        System.out.println("[verifyAvailability] Comprobando disponibilidad para producto ID " + productId + " con cantidad " + quantity);
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("[verifyAvailability] Driver JDBC cargado correctamente.");

            try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                 PreparedStatement ps = connection.prepareStatement("SELECT quantity FROM product_stock WHERE product_id = ?")) {

                System.out.println("[verifyAvailability] Conexión a BD establecida.");
                ps.setInt(1, productId);
                ResultSet rs = ps.executeQuery();

                if (rs.next()) {
                    int stock = rs.getInt("quantity");
                    System.out.println("[verifyAvailability] Stock disponible: " + stock);
                    return stock >= quantity;
                } else {
                    System.out.println("[verifyAvailability] Producto no encontrado.");
                }

            }
        } catch (Exception e) {
            System.out.println("[verifyAvailability] Error: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    public boolean decreaseStock(int productId, int quantity) {
        System.out.println("[decreaseStock] Intentando reducir stock de producto ID " + productId + " en " + quantity);
        if (!verifyAvailability(productId, quantity)) {
            System.out.println("[decreaseStock] No hay suficiente stock. Abortando.");
            return false;
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("[decreaseStock] Driver JDBC cargado correctamente.");

            try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                 PreparedStatement ps = connection.prepareStatement("UPDATE product_stock SET quantity = quantity - ? WHERE product_id = ?")) {

                System.out.println("[decreaseStock] Conexión a BD establecida.");
                ps.setInt(1, quantity);
                ps.setInt(2, productId);
                int result = ps.executeUpdate();
                System.out.println("[decreaseStock] Filas afectadas: " + result);
                return result > 0;
            }

        } catch (Exception e) {
            System.out.println("[decreaseStock] Error: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean increaseStock(int productId, int quantity) {
        System.out.println("[increaseStock] Intentando aumentar stock de producto ID " + productId + " en " + quantity);
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("[increaseStock] Driver JDBC cargado correctamente.");

            try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                 PreparedStatement ps = connection.prepareStatement("UPDATE product_stock SET quantity = quantity + ? WHERE product_id = ?")) {

                System.out.println("[increaseStock] Conexión a BD establecida.");
                ps.setInt(1, quantity);
                ps.setInt(2, productId);
                int result = ps.executeUpdate();
                System.out.println("[increaseStock] Filas afectadas: " + result);
                return result > 0;
            }

        } catch (Exception e) {
            System.out.println("[increaseStock] Error: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
