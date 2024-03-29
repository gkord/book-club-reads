import React, { Component } from "react";
import placeholder from '../styles/assets/placeholder.jpg'; 
import DisplayFirebase from "./DisplayFirebase";
import Modal from "./Modal";
import firebase from "firebase";


class Results extends Component {
  constructor() {
    super();
    this.state = {
      userGoal: {},
      modalShowing: false,
      select: "",
      addBook: "",
      fbBookIdArray: []
    };
  }

  //Display the search results
  renderDisplayBooks = () => {
    const bookList = this.props.displayBookResults.map((book, i) => {
      const first20 = book.best_book.title.replace(/(.{30})..+/, "$1...");
      return (
        <div key={i} className="resultsBlock"
          onClick={() => {
            this.selectBook(book);
          }}>
          <div
            className="bookImages"
            
          >
            <img
              src={
                book.best_book.image_url ===
                "https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png"
                  ? placeholder
                  : book.best_book.image_url
              }
              alt={book.best_book.title}
            />
          </div>
          <p className="bookNameResults">{book.best_book.title.length < 30 ? book.best_book.title : first20}</p>
          <p className="authorNameResults">{book.best_book.author.name}</p>
          
        </div>
      );
    });
    return bookList;
  };

  //If there is no returned data, render empty message
  renderEmptyState() {
    return (
      <div>
        <p>Add books to your collection</p>
      </div>
    );
  }
  //-------------------MODAL------------------------
  //Handle selected book details to pop as modal
  selectBook = book => {
    this.setState({
      select: book
    });
    this.openModal();
  };

  openModal = books => {
    this.setState({
      modalShowing: true
    });
  };

  closeModal = () => {
    this.setState({
      modalShowing: false
    });
  };

  //-------------------ADD BOOK------------------------

  //Gets user goal from App.js
  getUserGoal = () => {
    this.setState({
      userGoal: this.props.userGoal
    });
  };
  
  //Stores all the book id from reading list into an aray
  getFbBookId = () => {
      const dbRef = firebase.database().ref("Name");

      dbRef.on("value", data => {
        const response = data.val();
        const newState = []
       
        for (let key in response) {
          newState.push(response[key].BookId)
        }
        this.setState({
          fbBookIdArray: newState
        })        
      });
  }

  //Function  to check if book was already added in the list
  checkDuplicate = (bookToCheckDuplicate) => {
    let checkDuplicateId = [];
    checkDuplicateId = Object.values(bookToCheckDuplicate.id)

    const checkBookId = checkDuplicateId[1]
    
    const copiedArray = this.state.fbBookIdArray
    
    if (copiedArray.includes(`${checkBookId}`)) {
      alert('You already added this book')
    } else {
      this.addBook(bookToCheckDuplicate);
    }
  }
  
  //Add book to reading list
  addBook = bookToAdd => {
    let bookIdArray = []

    //Gets the book id
    bookIdArray = Object.values(bookToAdd.id)
    const bookId = bookIdArray[1]

    this.setState({
      addBook: bookToAdd
    });
    
    const dbRef = firebase.database().ref("Name");
    
    dbRef.push({
      Image: bookToAdd.best_book.image_url,
      Title: bookToAdd.best_book.title,
      Author: bookToAdd.best_book.author.name,
      Rating: bookToAdd.average_rating,
      Read: false,
      BookId: bookId
    });
  };
  //-------------------READING GOAL------------------------
  //Gets user goal from App.js
  getUserGoal = () => {
    this.setState({
      userGoal: this.props.userGoal
    });
  };
  //-------------------DISPLAY BOOKSHELF OR SEARCH------------------------
  bookshelfPage = () => {
    this.setState({
      resultsShowing: false,
      booklistShowing: true
    });
  };

  // Function to change state to render search page instead of bookshelf page
  searchPage = () => {
    this.setState({
      resultsShowing: true,
      booklistShowing: false
    });
  };

  componentDidMount() {
    this.renderDisplayBooks();
    this.getUserGoal();
    this.getFbBookId();
  }

  componentDidUpdate() {
    if (this.state.select === true) {
      this.selectBook();
    }
  }

  render() {
    return (
      <section className="content">
        <div className="resultOverlay">
          {this.props.resultsShowing &&
            (this.props.displayBookResults.length
              ? this.renderDisplayBooks()
              : this.renderEmptyState())}
          {this.props.booklistShowing && (
            <DisplayFirebase
              userGoal={this.state.userGoal}
              addBook={this.state.addBook}
            />
          )}
          {this.state.modalShowing && (
            <Modal
              close={this.closeModal}
              img={this.state.select.best_book.image_url}
              title={this.state.select.best_book.title}
              author={this.state.select.best_book.author.name}
              rating={this.state.select.average_rating}
              alt={this.state.select.best_book.title}
              addBook={this.checkDuplicate}
              selectBook={this.state.select}
            />
          )}
        </div>
      </section>
    );
  }
}

export default Results;
