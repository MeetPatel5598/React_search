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

  onButtonClickHandler = (event) => {
    const value = event.target.id;
    const { temp } = this.state;
    console.log(value);
  };

  render() {
    const { temp, searchTerm, showMessage } = this.state;

    return (
      <div className="card-flex">
        <input
          className="w3-input"
          type="text"
          placeholder="Search By Name"
          value={searchTerm}
          onChange={this.handleChange}
        />

        {temp.map((data, index) => {
          return (
            <div className="card" key={index}>
              <img src={data.imageUrl} alt="Image1" />
              <p>{data.fullName.toUpperCase()}</p>
              <button
                className="btn-text"
                value={showMessage}
                id={index}
                onClick={this.onButtonClickHandler}
              >
                +
              </button>

              <ul className="first-ul">
                <li>Email id : {data.email}</li>
                <li>Company : {data.company}</li>
                <li>Skill : {data.skill}</li>
                <li>Average : {data.average} %</li>
              </ul>
              {showMessage && (
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
              <input
                className="input-tag"
                type="text"
                placeholder="Tag"
                value={searchTerm}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
