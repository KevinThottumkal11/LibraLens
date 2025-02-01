// StAuth10244: I Kevin Binu Thottumkal, 000884769 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Image
} from 'react-native';

export default function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publishedYear: "",
    genre: "",
    numPages: "",
  });
  const [bookEdit, setBookEdit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [findBookModal, setFindBookModal] = useState(false);
  const [bookId, setBookId] = useState("");
  const [bookData, setBookData] = useState(null);

  const URL = 'http://localhost:3001/api';

  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async () => {
    try {
      const response = await fetch(URL);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch books");
    }
  };

  const addBook = async () => {
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newBook,
          publishedYear: parseInt(newBook.publishedYear),
          numPages: parseInt(newBook.numPages),
        }),
      });
      await response.json();
      setNewBook({
        title: "",
        author: "",
        publishedYear: "",
        genre: "",
        numPages: "",
      });
      setShowAddModal(false);
      getBooks();
    } catch (error) {
      Alert.alert("Error", "Failed to add book");
    }
  };

  const editBook = async (id) => {
    try {
      const response = await fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookEdit,
          publishedYear: parseInt(bookEdit.publishedYear),
          numPages: parseInt(bookEdit.numPages),
        }),
      });
      await response.json();
      setBookEdit(null);
      getBooks();
    } catch (error) {
      Alert.alert("Error", "Failed to update book");
    }
  };

  const deleteBook = async (id) => {
    try {
      const response = await fetch(`${URL}/${id}`, {
        method: 'DELETE',
      });
      await response.json();
      getBooks();
    } catch (error) {
      Alert.alert("Error", "Failed to delete book");
    }
  };

  const findBookById = async () => {
    try {
      const response = await fetch(`${URL}/${bookId}`);
      if (response.status === 404) {
        Alert.alert("Error", "Book not found");
        return;
      }
      const data = await response.json();
      setBookData(data);
      setFindBookModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to find book");
    }
  };

  const deleteAllBooks = () => {
    if (books.length > 0) {
      setShowDeleteConfirmModal(true);
    }
  };

  const deleteConfirm = async () => {
    try {
      const response = await fetch(URL, {
        method: 'DELETE',
      });
      await response.json();
      getBooks();
      setShowDeleteConfirmModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to delete all books");
    }
  };

  return (
    // Header
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LibraLens</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}>
            <Image 
              source={require('./assets/add_icon_new.png')} 
              style={styles.headerIcon}
            />
            <Text style={styles.buttonText}>Add New Book</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.findButton,
              books.length == 0 && styles.disabledButton
            ]}
            onPress={() => setFindBookModal(true)}
            disabled={books.length == 0}>
            <Image 
              source={require('./assets/find_icon.png')} 
              style={styles.headerIcon}
            />
            <Text style={[
              styles.buttonText,
              books.length === 0 && styles.disabledButtonText
            ]}>Find Book by Id</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deleteAllButton,
              books.length == 0 && styles.disabledButton
            ]}
            disabled={books.length == 0}
            onPress={deleteAllBooks}>
            <Image 
              source={require('./assets/delete_icon.png')} 
              style={styles.headerIcon}
            />
            <Text style={[
              styles.buttonText,
              books.length === 0 && styles.disabledButtonText
            ]}>Delete All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Collection Table */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Id</Text>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Book Title</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Author</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Genre</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Year</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Pages</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}></Text>
      </View>

      <ScrollView style={styles.tableContent}>
        {books.map((book) => (
          <View key={book.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>{book.id}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>{book.title}</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={1}>{book.author}</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={1}>{book.genre}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{book.publishedYear}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{book.numPages}</Text>
            <View style={[styles.tableCellActions, { flex: 1 }]}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setBookEdit(book)}>
                <Image 
                  source={require('./assets/edit_icon.png')} 
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => deleteBook(book.id)}>
                <Image 
                  source={require('./assets/delete_red_icon.png')} 
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Book Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Book</Text>
            <TextInput
              style={styles.input}
              placeholder="Book Title"
              value={newBook.title}
              onChangeText={(text) => setNewBook({ ...newBook, title: text })}/>
            <TextInput
              style={styles.input}
              placeholder="Author"
              value={newBook.author}
              onChangeText={(text) => setNewBook({ ...newBook, author: text })}/>
            <TextInput
              style={styles.input}
              placeholder="Genre"
              value={newBook.genre}
              onChangeText={(text) => setNewBook({ ...newBook, genre: text })}/>
            <TextInput
              style={styles.input}
              placeholder="Published Year"
              value={newBook.publishedYear}
              onChangeText={(text) => setNewBook({ ...newBook, publishedYear: text })}
              keyboardType="numeric"/>
            <TextInput
              style={styles.input}
              placeholder="Number of Pages"
              value={newBook.numPages}
              onChangeText={(text) => setNewBook({ ...newBook, numPages: text })}
              keyboardType="numeric"/>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewBook({
                    title: "",
                    author: "",
                    publishedYear: "",
                    genre: "",
                    numPages: "",
                  });
                }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addBook}>
                <Text style={styles.buttonText}>Add Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Book Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!bookEdit}
        onRequestClose={() => setBookEdit(null)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Book</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={bookEdit?.title}
              onChangeText={(text) => setBookEdit({ ...bookEdit, title: text })}/>
            <TextInput
              style={styles.input}
              placeholder="Author"
              value={bookEdit?.author}
              onChangeText={(text) => setBookEdit({ ...bookEdit, author: text })}/>
            <TextInput
              style={styles.input}
              placeholder="Genre"
              value={bookEdit?.genre}
              onChangeText={(text) => setBookEdit({ ...bookEdit, genre: text })}/>
            <TextInput
              style={styles.input}
              placeholder="Year Published"
              value={bookEdit?.publishedYear.toString()}
              onChangeText={(text) => setBookEdit({ ...bookEdit, publishedYear: text })}
              keyboardType="numeric"/>
            <TextInput
              style={styles.input}
              placeholder="Page Count"
              value={bookEdit?.numPages.toString()}
              onChangeText={(text) => setBookEdit({ ...bookEdit, numPages: text })}
              keyboardType="numeric"/>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setBookEdit(null)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => editBook(bookEdit.id)}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Find Book by Id Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={findBookModal}
        onRequestClose={() => setFindBookModal(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Book Id</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Book ID"
              value={bookId}
              onChangeText={setBookId}
              keyboardType="numeric"/>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setFindBookModal(false);
                  setBookId("");
                }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={findBookById}>
                <Text style={styles.buttonText}>Find</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Book(Inof) Found Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!bookData}
        onRequestClose={() => setBookData(null)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book Details</Text>
            <View style={styles.bookDetails}>
              <Text style={styles.bookDetailRow}>
                <Text style={styles.bookDetailLabel}>Id: </Text>
                {bookData?.id}
              </Text>
              <Text style={styles.bookDetailRow}>
                <Text style={styles.bookDetailLabel}>Title: </Text>
                {bookData?.title}
              </Text>
              <Text style={styles.bookDetailRow}>
                <Text style={styles.bookDetailLabel}>Author: </Text>
                {bookData?.author}
              </Text>
              <Text style={styles.bookDetailRow}>
                <Text style={styles.bookDetailLabel}>Genre: </Text>
                {bookData?.genre}
              </Text>
              <Text style={styles.bookDetailRow}>
                <Text style={styles.bookDetailLabel}>Year: </Text>
                {bookData?.publishedYear}
              </Text>
              <Text style={styles.bookDetailRow}>
                <Text style={styles.bookDetailLabel}>Pages: </Text>
                {bookData?.numPages}
              </Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setBookData(null);
                  setBookId("");
                }}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete all books modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteConfirmModal}
        onRequestClose={() => setShowDeleteConfirmModal(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>DELETE ALL BOOKS</Text>
            <Text style={styles.modalText}>Do you want to permanently delete all the books data?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteConfirmModal(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={deleteConfirm}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  headerButtons: {
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  addButton: {
    backgroundColor: "limegreen",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 5,
    marginRight: 10,
    flex: 2.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 160
  },
  findButton: {
    backgroundColor: "#2e86c1",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 5,
    marginRight: 10,
    flex: 2.3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteAllButton: {
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    flex: 1.6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2c3e50",
    padding: 15,
  },
  tableHeaderCell: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 5,
  },
  tableContent: {
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "darkgray",
    alignItems: "center",
  },
  tableCell: {
    fontSize: 15,
    color: "#2c3e50",
    paddingHorizontal: 5,
  },
  tableCellActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  deleteButton: {
    backgroundColor: "red",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 12,
    color: "black",
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#d5d8dc",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalText: {
    textAlign: "center",
    color: "black",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  bookDetails: {
    marginBottom: 20,
  },
  bookDetailRow: {
    fontSize: 16,
    marginBottom: 10,
    color: "#2c3e50",
  },
  bookDetailLabel: {
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#abb2b9",
  },
  saveButton: {
    backgroundColor: "limegreen",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  disabledButtonText: {
    color: "#darkgray",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  headerIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 5,
  },
});