import React, { Component } from 'react';

class Results extends Component {

//display the search results
renderDisplayBooks = () => {
  const bookList = this.props.displayBookResults.map((book, i) => {
    return (
      <div key={i}>
        <div className="bookImages"
              onClick={()=>this.props.addBook(book)}
        >
          <img src={book.best_book.image_url} alt=""/>
        </div>
      </div>
    )
  });
  return (<div className="displayBooksContainer">{bookList}</div>);
}  

//if there is no returned data, render this
renderEmptyState(){
  return(
    <div>
      <p>Add books to your collection</p>
    </div>
  )
}



componentDidMount(){
  this.renderDisplayBooks()

  // dbRef.on('value', (data) => {

  //   //grab the data from FB, return an object
  //   data = data.val();

  //   //go through this object, and turn it into an array 
  //   console.log(data)

  // })
}

  render(){
    return(
      <div>
        <div className="displayBackground">
          <h2 className=""> Results</h2>
          <div>
            {this.props.displayBookResults.length ? this.renderDisplayBooks() : this.renderEmptyState()}
          </div>
        </div>
      </div>
    )
}


  
  
} 

export default Results;