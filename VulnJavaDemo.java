import java.sql.*;

public class VulnJavaDemo {
    public static void main(String[] args) {
        String userInput = args.length > 0 ? args[0] : "";
        try {
            Connection conn = DriverManager.getConnection("jdbc:sqlite:demo.db");
            Statement stmt = conn.createStatement();
            // Vulnerable to SQL injection
            String sql = "SELECT * FROM users WHERE name = '" + userInput + "'";
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                System.out.println("User: " + rs.getString("name"));
            }
            rs.close();
            stmt.close();
            conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}