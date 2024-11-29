package csu33012_2425_group19.demo.controller;

import csu33012_2425_group19.demo.entity.ShoppingList;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;

class ShoppingListControllerTest {
    
    private ShoppingListController controller;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        controller = new ShoppingListController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void testAddNewItem() {

        ShoppingList item = new ShoppingList();
        item.setItem("Apples");
        item.setQuantity(5);


        String result = controller.addItem(item);
        

        assertEquals("Added Apples to the shopping list", result);
        assertEquals(1, controller.getItems().size());
        assertEquals(5, controller.getItems().get(0).getQuantity());
    }

    @Test
    void testAddExistingItem() {

        ShoppingList item1 = new ShoppingList();
        item1.setItem("Bananas");
        item1.setQuantity(3);
        controller.addItem(item1);

        ShoppingList item2 = new ShoppingList();
        item2.setItem("Bananas");
        item2.setQuantity(2);


        String result = controller.addItem(item2);
        

        assertEquals("Updated quantity of Bananas", result);
        assertEquals(1, controller.getItems().size());
        assertEquals(5, controller.getItems().get(0).getQuantity());
    }

    @Test
    void testGetItems() {

        ShoppingList item = new ShoppingList();
        item.setItem("Milk");
        item.setQuantity(2);
        controller.addItem(item);


        var items = controller.getItems();
        

        assertEquals(1, items.size());
        assertEquals("Milk", items.get(0).getItem());
        assertEquals(2, items.get(0).getQuantity());
    }

    @Test
    void testUpdateQuantity() {

        ShoppingList item = new ShoppingList();
        item.setItem("Bread");
        item.setQuantity(1);
        controller.addItem(item);


        String result = controller.updateQuantity("Bread", 3);
        

        assertEquals("Updated quantity of Bread to 3", result);
        assertEquals(3, controller.getItems().get(0).getQuantity());
    }

    @Test
    void testUpdateQuantityNonExistentItem() {

        String result = controller.updateQuantity("NonExistentItem", 5);
        

        assertEquals("NonExistentItem not found in the shopping list", result);
    }

    @Test
    void testDeleteItem() {

        ShoppingList item = new ShoppingList();
        item.setItem("Eggs");
        item.setQuantity(12);
        controller.addItem(item);


        String result = controller.deleteItem("Eggs");
        

        assertEquals("Removed Eggs from shopping list", result);
        assertTrue(controller.getItems().isEmpty());
    }

    @Test
    void testDeleteNonExistentItem() {

        String result = controller.deleteItem("NonExistentItem");
        

        assertEquals("NonExistentItem not found in the shopping list", result);
    }

    @Test
    void testEmptyShoppingList() {

        assertTrue(controller.getItems().isEmpty());
    }

    @Test
    void testCaseInsensitiveOperations() {

        ShoppingList item = new ShoppingList();
        item.setItem("Cheese");
        item.setQuantity(1);
        controller.addItem(item);


        String updateResult = controller.updateQuantity("CHEESE", 2);
        assertEquals("Updated quantity of CHEESE to 2", updateResult);
        
        String deleteResult = controller.deleteItem("cheese");
        assertEquals("Removed cheese from shopping list", deleteResult);
    }
}