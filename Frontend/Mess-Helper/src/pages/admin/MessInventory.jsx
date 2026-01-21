import React, { useEffect, useState } from "react";
import styles from "../../styles/MessInventory.module.css";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const MessInventory = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch items - fixed to properly display data
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/fetch/items", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch items");

        const data = await response.json();
        console.log("Fetched data:", data); // Debug log
        
        // Handle both array and object response formats
        const itemsArray = Array.isArray(data) ? data : (data.items || []);
        
        if (itemsArray.length > 0) {
          const formattedItems = itemsArray.map(item => ({
            id: item.ID || item.id || `item-${Date.now()}`,
            name: item.ITEM_NAME || item.name || "",
            quantity: item.QUANTITY || item.quantity || "",
            cost: item.COST_PER_UNIT || item.cost || ""
          }));
          
          setItems(formattedItems);
          setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated) : new Date());
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Add new row to newItems
  const addNewRow = () => {
    setNewItems([
      ...newItems,
      { id: Date.now(), name: "", quantity: "", cost: "" }
    ]);
  };

  // Update new item
  const updateNewItem = (id, field, value) => {
    setNewItems(
      newItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Save only new items
  const saveNewItems = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          items: newItems.filter(item => item.name && item.quantity && item.cost)
        }),
      });

      if (!response.ok) throw new Error("Failed to save new items");
      
      const result = await response.json();
      console.log("Save result:", result);
      
      // Update UI after successful save
      setItems([...items, ...newItems]);
      setNewItems([]);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate totals
  const calculateTotal = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const cost = parseFloat(item.cost) || 0;
    return (quantity * cost).toFixed(2);
  };

  const grandTotal = items.reduce(
    (total, item) => total + (parseFloat(item.quantity) || 0) * (parseFloat(item.cost) || 0),
    0
  ).toFixed(2);

  if (!user) return <div>Please Login...</div>;
  if (isLoading) return <div className={styles.loading}>Loading inventory...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mess Inventory</h1>
      {lastUpdated && (
        <div className={styles.lastUpdated}>
          Last Updated: {lastUpdated.toLocaleString()}
        </div>
      )}

      {/* Existing Inventory Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity (kg)</th>
            <th>Cost/Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.noItems}>
                No inventory items found
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.cost}</td>
                <td className={styles.total}>₹{calculateTotal(item)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={styles.grandTotal}>
        Grand Total: ₹{grandTotal}
      </div>

      {/* New Items Section */}
      <div className={styles.addSection}>
        <h2>Add New Items</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity (kg)</th>
              <th>Cost/Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateNewItem(item.id, "name", e.target.value)}
                    className={styles.input}
                    placeholder="Enter item name"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateNewItem(item.id, "quantity", e.target.value)}
                    className={styles.input}
                    placeholder="0.00"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.cost}
                    onChange={(e) => updateNewItem(item.id, "cost", e.target.value)}
                    className={styles.input}
                    placeholder="0.00"
                  />
                </td>
                <td>
                  <button
                    onClick={() => setNewItems(newItems.filter(i => i.id !== item.id))}
                    className={styles.deleteBtn}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.buttonGroup}>
          <button onClick={addNewRow} className={styles.addBtn}>
            <FaPlusCircle /> Add Row
          </button>
          <button
            onClick={saveNewItems}
            disabled={isSaving || newItems.length === 0}
            className={styles.saveBtn}
          >
            <FaSave /> {isSaving ? "Saving..." : "Save New Items"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessInventory;