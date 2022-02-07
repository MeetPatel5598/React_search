import React, { Component } from "react";
import "../Profile/Profile.css";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      temp: [],
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
                  firstName: item.firstName,
                  lastName: item.lastName,
                  imageUrl: item.pic,
                  email: item.email,
                  average: averageGrades,
                  company: item.company,
                  skill: item.skill,
                };
                newData.push({ ...obj });
              });
            }
          }
          this.setState({
            temp: newData,
          });
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
  }

  render() {
    const { temp } = this.state;
    return (
      <div className="card-flex">
        {temp.map((data, index) => {
          return (
            <div className="card">
              <div key={index}>
                <img src={data.imageUrl} alt="Girl in a jacket" />
                <h3>
                  {data.firstName} {data.lastName}
                </h3>
                <p>Email id : {data.email}</p>
                <p>Company : {data.company}</p>
                <p>Skill : {data.skill}</p>
                <p>Average : {data.average}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
