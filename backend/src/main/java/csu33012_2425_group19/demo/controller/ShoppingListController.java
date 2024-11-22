package csu33012_2425_group19.demo.controller;

import csu33012_2425_group19.demo.entity.ShoppingList;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/shoppinglist")
public class ShoppingListController {
    private final List<ShoppingList> shoppingList = new ArrayList<>();

    // Find an item by name
    private Optional<ShoppingList> findItemByName(String itemName) {
        return shoppingList.stream()
                           .filter(item -> item.getItem().equalsIgnoreCase(itemName))
                           .findFirst();
    }

    // Add/update item quantity
    @PostMapping("/add")
    public String addItem(@RequestBody ShoppingList newItem) {
        Optional<ShoppingList> existingItem = findItemByName(newItem.getItem());
        if (existingItem.isPresent()) {
            ShoppingList item = existingItem.get();
            item.setQuantity(item.getQuantity() + newItem.getQuantity());
            return "Updated quantity of " + item.getItem();
        } else {
            shoppingList.add(newItem);
            return "Added " + newItem.getItem() + " to the shopping list";
        }
    }

    // Get all items
    @GetMapping("/items")
    public List<ShoppingList> getItems() {
        return shoppingList;
    }

    // Adjust quantity
    @PutMapping("/updateQuantity/{itemName}")
    public String updateQuantity(@PathVariable String itemName, @RequestParam int quantity) {
        Optional<ShoppingList> existingItem = findItemByName(itemName);
        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(quantity);
            return "Updated quantity of " + itemName + " to " + quantity;
        } else {
            return itemName + " not found in the shopping list";
        }
    }

    // Remove item
    @DeleteMapping("/delete/{itemName}")
    public String deleteItem(@PathVariable String itemName) {
        Optional<ShoppingList> existingItem = findItemByName(itemName);
        if (existingItem.isPresent()) {
            shoppingList.remove(existingItem.get());
            return "Removed " + itemName + " from shopping list";
        } else {
            return itemName + " not found in the shopping list";
        }
    }
}