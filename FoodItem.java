
import java.util.*;

class FoodItem {
    int id;
    String name;
    double price;

    FoodItem(int id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    void display() {
        System.out.printf("%-5d %-20s Rs. %.2f%n", id, name, price);
    }
}

class Order {
    int orderId;
    String customerName;
    ArrayList<FoodItem> items;
    double total;

    Order(int orderId, String customerName,
          ArrayList<FoodItem> items, double total) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.items = new ArrayList<>(items);
        this.total = total;
    }

    void displayOrder() {
        System.out.println("\nOrder ID: " + orderId);
        System.out.println("Customer: " + customerName);
        System.out.println("Items:");

        for (FoodItem item : items) {
            System.out.println("- " + item.name
                    + " (Rs. " + item.price + ")");
        }

        System.out.printf("Total Amount: Rs. %.2f%n", total);
    }
}

public class OnlineFoodOrderingSystem {

    static Scanner sc = new Scanner(System.in);

    static ArrayList<FoodItem> foodList = new ArrayList<>();
    static HashMap<Integer, FoodItem> foodMap = new HashMap<>();
    static Queue<Order> orderQueue = new LinkedList<>();
    static HashMap<Integer, Order> orderHistory = new HashMap<>();

    static int nextOrderId = 1001;
    static int nextFoodId = 1;

    // Add initial food items
    static void initializeMenu() {
        addFood("Burger", 120);
        addFood("Pizza", 250);
        addFood("Sandwich", 80);
        addFood("Fried Rice", 150);
        addFood("Chicken Biriyani", 180);
    }

    // Add food item
    static void addFood(String name, double price) {
        FoodItem food = new FoodItem(nextFoodId++, name, price);
        foodList.add(food);
        foodMap.put(food.id, food);
    }

    // Display menu
    static void displayMenu() {
        System.out.println("\n========== FOOD MENU ==========");
        System.out.printf("%-5s %-20s %s%n", "ID", "Food Name", "Price");

        for (FoodItem food : foodList) {
            food.display();
        }
    }

    // Add a new food item
    static void addNewFood() {
        System.out.print("Enter food name: ");
        String name = sc.nextLine();

        double price = readDouble("Enter price: ");

        if (price <= 0) {
            System.out.println("Price must be greater than zero.");
            return;
        }

        addFood(name, price);
        System.out.println("Food item added successfully!");
    }

    // Search food
    static void searchFood() {
        System.out.print("Enter food name to search: ");
        String name = sc.nextLine();

        boolean found = false;

        for (FoodItem food : foodList) {
            if (food.name.equalsIgnoreCase(name)) {
                food.display();
                found = true;
            }
        }

        if (!found) {
            System.out.println("Food item not found.");
        }
    }

    // Update food price
    static void updateFood() {
        displayMenu();

        int id = readInt("Enter food ID to update: ");
        FoodItem food = foodMap.get(id);

        if (food == null) {
            System.out.println("Food item not found.");
            return;
        }

        double newPrice = readDouble("Enter new price: ");

        if (newPrice <= 0) {
            System.out.println("Price must be greater than zero.");
            return;
        }

        food.price = newPrice;
        System.out.println("Food price updated successfully!");
    }

    // Remove food item
    static void removeFood() {
        displayMenu();

        int id = readInt("Enter food ID to remove: ");
        FoodItem food = foodMap.remove(id);

        if (food == null) {
            System.out.println("Food item not found.");
            return;
        }

        foodList.remove(food);
        System.out.println("Food item removed successfully!");
    }

    // Place order
    static void placeOrder() {
        System.out.print("Enter customer name: ");
        String customerName = sc.nextLine();

        if (customerName.trim().isEmpty()) {
            System.out.println("Customer name cannot be empty.");
            return;
        }

        ArrayList<FoodItem> cart = new ArrayList<>();
        double total = 0;

        while (true) {
            displayMenu();
            System.out.println("Enter food ID to add to cart.");
            System.out.println("Enter 0 to finish ordering.");

            int id = readInt("Food ID: ");

            if (id == 0) {
                break;
            }

            FoodItem food = foodMap.get(id);

            if (food == null) {
                System.out.println("Invalid food ID. Try again.");
                continue;
            }

            cart.add(food);
            total += food.price;

            System.out.println(food.name + " added to cart.");
        }

        if (cart.isEmpty()) {
            System.out.println("No items selected. Order cancelled.");
            return;
        }

        Order order = new Order(nextOrderId++, customerName, cart, total);

        orderQueue.offer(order);
        orderHistory.put(order.orderId, order);

        System.out.println("\nOrder placed successfully!");
        order.displayOrder();
    }

    // Process the next order
    static void processOrder() {
        Order order = orderQueue.poll();

        if (order == null) {
            System.out.println("No pending orders.");
            return;
        }

        System.out.println("\nProcessing order...");
        order.displayOrder();
        System.out.println("Order completed successfully!");
    }

    // Search order details
    static void searchOrder() {
        int id = readInt("Enter order ID: ");
        Order order = orderHistory.get(id);

        if (order == null) {
            System.out.println("Order not found.");
        } else {
            order.displayOrder();
        }
    }

    // Display pending orders
    static void displayPendingOrders() {
        if (orderQueue.isEmpty()) {
            System.out.println("No pending orders.");
            return;
        }

        System.out.println("\n========== PENDING ORDERS ==========");

        for (Order order : orderQueue) {
            System.out.println("Order ID: " + order.orderId
                    + " | Customer: " + order.customerName
                    + " | Total: Rs. " + order.total);
        }
    }

    // Read integer safely
    static int readInt(String message) {
        while (true) {
            System.out.print(message);

            try {
                int value = Integer.parseInt(sc.nextLine().trim());
                return value;
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid integer.");
            }
        }
    }

    // Read decimal number safely
    static double readDouble(String message) {
        while (true) {
            System.out.print(message);

            try {
                double value = Double.parseDouble(sc.nextLine().trim());

                if (Double.isFinite(value)) {
                    return value;
                }
            } catch (NumberFormatException e) {
                // Display the error below.
            }

            System.out.println("Please enter a valid number.");
        }
    }

    public static void main(String[] args) {

        initializeMenu();

        while (true) {
            System.out.println("\n==================================");
            System.out.println("   ONLINE FOOD ORDERING SYSTEM");
            System.out.println("==================================");
            System.out.println("1. View Food Menu");
            System.out.println("2. Place Order");
            System.out.println("3. Search Food");
            System.out.println("4. Add New Food Item");
            System.out.println("5. Update Food Price");
            System.out.println("6. Remove Food Item");
            System.out.println("7. Process Next Order");
            System.out.println("8. View Pending Orders");
            System.out.println("9. Search Order Details");
            System.out.println("10. Exit");

            int choice = readInt("Enter your choice: ");

            switch (choice) {
                case 1:
                    displayMenu();
                    break;

                case 2:
                    placeOrder();
                    break;

                case 3:
                    searchFood();
                    break;

                case 4:
                    addNewFood();
                    break;

                case 5:
                    updateFood();
                    break;

                case 6:
                    removeFood();
                    break;

                case 7:
                    processOrder();
                    break;

                case 8:
                    displayPendingOrders();
                    break;

                case 9:
                    searchOrder();
                    break;

                case 10:
                    System.out.println("Thank you for using our system!");
                    sc.close();
                    return;

                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }
    }
}
```
