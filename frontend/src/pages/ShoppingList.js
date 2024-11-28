import React, { useState } from 'react';
import testImage from '../assets/images/testBackground2k.jpg';

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, { name: newItem.trim(), checked: false }]);
      setNewItem('');
    }
  };

  const toggleItemChecked = (index) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
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
          {items.map((item, index) => (
            <li key={index} style={styles.item}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItemChecked(index)}
                style={styles.checkbox}
              />
              <span style={{ textDecoration: item.checked ? 'line-through' : 'none' }}>
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  background: {
    height: '100vh',
    backgroundImage: `url(${testImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    padding: '30px',
    borderRadius: '15px',
    width: '80%',
    maxWidth: '500px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', 
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
};

export default ShoppingList;