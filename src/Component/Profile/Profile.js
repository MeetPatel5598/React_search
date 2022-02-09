import React, { Component } from "react";
import "../Profile/Profile.css";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      temp: [],
      searchData: [],
      searchTerm: "",
      searchTag: "",
    };
  }

  componentDidMount() {
    fetch("https://api.hatchways.io/assessment/students")
      .then((res) => res.json())
      .then(
        (result) => {
          let newData = [];
          if (result) {
            if ("students" in result) {
              const arrAvg = (arr) =>
                arr.reduce((a, b) => parseInt(a) + parseInt(b), 0) / arr.length;
              result.students.forEach((item, index) => {
                const averageGrades = arrAvg(item.grades).toFixed(2);
                let obj = {
                  id: index,
                  fullName: item.firstName + " " + item.lastName,
                  imageUrl: item.pic,
                  email: item.email,
                  grades: item.grades,
                  average: averageGrades,
                  company: item.company,
                  skill: item.skill,
                  showMessage: false,
                  button: "+",
                  tag: [],
                  addTag: "",
                };
                newData.push({ ...obj });
              });
            }
          }
          this.setState({
            temp: newData,
            searchData: newData,
          });
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
  }

  handleChange = (event) => {
    const { searchData } = this.state;
    const value = event.target.value;
    this.setState({ searchTerm: value });
    const results = searchData.filter((temp) => {
      return temp.fullName.toLowerCase().includes(value.toLowerCase());
    });
    this.setState({ temp: results });
  };

  handleChangeTag = (event) => {
    const { searchData } = this.state;
    const value = event.target.value;
    this.setState({ searchTag: value });
    console.log(searchData);

    const results = searchData.filter((temp) => {
      return temp.tag.includes(value);
    });
    console.log(results);
    this.setState({ temp: results });
  };

  addTagHandler = (event) => {
    const value = event.target.value;
    const id = event.target.id;
    const { temp } = this.state;
    temp[id].addTag = value;
    this.setState({ temp: temp });
    if (event.key) {
      temp[id].tag.push(value);
      temp[id].addTag = "";
      this.setState({ searchData: temp });
    }
  };

  keyPress = (event) => {
    if (event.key === "Enter") {
      this.addTagHandler(event);
    }
  };

  onButtonClickHandler = (event) => {
    const value = event.target.id;
    const { temp } = this.state;
    if (temp[value].showMessage) {
      temp[value].button = "+";
      temp[value].showMessage = false;
    } else {
      temp[value].button = "-";
      temp[value].showMessage = true;
    }
    this.setState({ temp: temp });
  };

  render() {
    const { temp, searchTerm, searchTag } = this.state;

    return (
      <div className="card-flex">
        <input
          className="w3-input"
          type="text"
          placeholder="Search By Name"
          value={searchTerm}
          onChange={this.handleChange}
        />
        <input
          className="w3-input"
          type="text"
          placeholder="Search By Tag"
          value={searchTag}
          onChange={this.handleChangeTag}
        />

        {temp.map((data, index) => {
          return (
            <div className="card" key={index}>
              <img src={data.imageUrl} alt="Image1" />
              <p>{data.fullName.toUpperCase()}</p>
              <button
                className="accordion"
                value={data.showMessage}
                id={index}
                onClick={this.onButtonClickHandler}
              >
                {data.button}
              </button>

              <ul className="first-ul">
                <li>Email id : {data.email}</li>
                <li>Company : {data.company}</li>
                <li>Skill : {data.skill}</li>
                <li>Average : {data.average} %</li>
              </ul>
              {data.showMessage && (
                <ul className="second-ul">
                  {data.grades.map((item, index) => {
                    return (
                      <li key={index}>
                        {" "}
                        Test {index + 1} : {item}
                      </li>
                    );
                  })}
                </ul>
              )}
              {data.tag.map((item, index) => {
                return (
                  <span className="a" key={index}>
                    {item}
                  </span>
                );
              })}

              <input
                className="tag-btn"
                type="text"
                placeholder="Add a tag"
                id={index}
                value={data.addTag}
                onKeyDown={(event) => this.keyPress(event)}
                onChange={this.addTagHandler}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
