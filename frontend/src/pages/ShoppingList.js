import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import testImage from '../assets/images/testBackground2k.jpg';


const roundToFraction = (decimal) => {
  const fractions = [
    { value: 1, label: '1' },
    { value: 0.75, label: '3/4' },
    { value: 0.5, label: '1/2' },
    { value: 0.25, label: '1/4' },
    { value: 0.125, label: '1/8' },
    { value: 0.3333333333, label: '1/3' },
    { value: 0.6666666667, label: '2/3' },
  ];

  
  const closest = fractions.reduce((prev, curr) =>
    Math.abs(curr.value - decimal) < Math.abs(prev.value - decimal) ? curr : prev
  );

  return closest.label;
};

function ShoppingList() {
  const location = useLocation();
  const [items, setItems] = useState(
    (location.state?.ingredients || []).map((ingredient) => ({
      name: ingredient,
      checked: false,
    }))
  );
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([
        ...items,
        { name: newItem.trim(), checked: false }
      ]);
      setNewItem('');
    }
  };

  const toggleItemChecked = (index) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h1 style={styles.title}>Shopping List</h1>
        <p style={styles.description}>Add your ingredients to the list:</p>

        <div style={styles.inputContainer}>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter an ingredient..."
            style={styles.input}
          />
          <button onClick={handleAddItem} style={styles.addButton}>
            Add
          </button>
        </div>

        <ul style={styles.items}>
          {items.map((item, index) => {
            const roundedItem = roundToFraction(item.name.match(/([\d.]+)/)?.[0] || 0);
            return (
              <li key={index} style={styles.item}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItemChecked(index)}
                  style={styles.checkbox}
                />
                <span style={{ textDecoration: item.checked ? 'line-through' : 'none' }}>
                  {item.name.replace(/[\d.]+/, roundedItem)}
                </span>
              </li>
            );
          })}
        </ul>

        <button onClick={handlePrint} style={styles.printButton}>
          Print Shopping List
        </button>
      </div>
    </div>
  );
}

const styles = {
  background: {
    minHeight: '100vh', 
    backgroundImage: `url(${testImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    backgroundAttachment: 'fixed', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px',
    overflowY: 'auto', 
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    padding: '20px',
    borderRadius: '15px',
    width: '80%',
    maxWidth: '500px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    marginTop: '60px',  
  },
  title: {
    color: '#333',
    fontSize: '2.2rem',
    marginBottom: '15px',
  },
  description: {
    color: '#666',
    fontSize: '1.2rem',
    marginBottom: '25px',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    flex: '1',
    marginRight: '10px',
  },
  addButton: {
    padding: '0.8rem 1.2rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  items: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.1rem',
    color: '#444',
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
  },
  checkbox: {
    marginRight: '10px',
    width: '20px',
    height: '20px',
  },
  printButton: {
    marginTop: '20px',
    padding: '0.8rem 1.2rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default ShoppingList;
