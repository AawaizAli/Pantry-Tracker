"use client";
import { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import {
    query,
    collection,
    getDocs,
    deleteDoc,
    setDoc,
    doc,
    getDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase";

export default function Home() {
    const [inventory, setInventory] = useState([]);
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, "inventory"));
        const docs = await getDocs(snapshot);
        const inventoryList = [];
        docs.forEach((doc) => {
            inventoryList.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        console.log(inventoryList);
        setInventory(inventoryList);
    };

    const removeItem = async (item) => {
        const docRef = doc(collection(firestore, "inventory"), item.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { quantity } = docSnap.data();

            if (quantity === 1) {
                await deleteDoc(docRef);
            } else {
                await setDoc(docRef, { quantity: quantity - 1 });
            }
        }

        await updateInventory();
    };

    const addItem = async (item) => {
        const docRef = doc(collection(firestore, "inventory"), item.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { quantity } = docSnap.data();
            await setDoc(docRef, { quantity: quantity + 1 });
        } else {
            await setDoc(docRef, { quantity: 1 });
        }

        await updateInventory();
    };

    useEffect(() => {
        updateInventory();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddNewItem = async () => {
        if (itemName.trim()) {
            await addItem({ id: itemName });
            setItemName("");
            handleClose();
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredInventory = inventory.filter((item) =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "18px",
                flexDirection: "column",
            }}>
            <Typography variant="h2">My Inventory Tracker</Typography>
            <TextField
                variant="outlined"
                placeholder="Search items"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ width: "250px", height: '50px'}}
            />
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}>
                    <Typography variant="h6" component="h2">
                        Add New Inventory Item
                    </Typography>
                    <TextField
                        fullWidth
                        label="Item Name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        sx={{ marginTop: 2, marginBottom: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddNewItem}>
                        Add Item
                    </Button>
                </Box>
            </Modal>
            <List
                sx={{
                    width: "100%",
                    maxWidth: 600,
                    bgcolor: "background.paper",
                }}>
                {filteredInventory.map((item) => (
                    <ListItem
                        key={item.id}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "5px",
                        }}>
                        <ListItemText
                            primary={`Name: ${
                                item.id.charAt(0).toUpperCase() +
                                item.id.slice(1)
                            }`}
                            secondary={`Quantity: ${item.quantity || 0}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                aria-label="add"
                                onClick={() => addItem(item)}>
                                <Add />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="remove"
                                onClick={() => removeItem(item)}>
                                <Remove />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() =>
                                    deleteDoc(
                                        doc(firestore, "inventory", item.id)
                                    ).then(updateInventory)
                                }>
                                <Delete />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Add New Item
            </Button>
        </Box>
    );
}
