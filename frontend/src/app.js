import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [family, setFamily] = useState();
  useEffect(() => {
    axios.get("http://localhost:4000").then((response) => {
      console.log(response.data);
      setFamily(response.data);
    });
  }, []);

  if (!family) {
    return (
      <div>
        <header>CS 555 Sprint 3</header>
        <h3> Loading... </h3>
      </div>
    );
  }

  return (
    <div>
      <header>CS 555 Sprint 3</header>
      <div className="table">
        <div className="titleRow"> Individuals List </div>
        <div className="subTitleRow">
          <div className="col">ID</div>
          <div className="col">Name</div>
          <div className="col">Gender</div>
          <div className="col">Birthday</div>
          <div className="col">Age</div>
          <div className="col">Death</div>
          <div className="col">SpouseFamily</div>
          <div className="col">ChildOfFamily</div>
        </div>
        {family.map((familyMember, i) => {
          if (familyMember.ID[0] == "I") {
            return (
              <li className="row">
                <div className="col">{familyMember.ID}</div>
                <div className="col">{familyMember.Name}</div>
                <div className="col">{familyMember.Gender}</div>
                <div className="col">{familyMember.Birthday}</div>
                <div className="col">{familyMember.Age}</div>
                <div className="col">{familyMember.Death}</div>
                <div className="col">{familyMember.SpouseFamily}</div>
                <div className="col">{familyMember.ChildOfFamily}</div>
              </li>
            );
          }
        })}
      </div>
      <div className="table">
        <div className="row"> Families List </div>
        {family.map((wholeFamily, i) => {
          if (wholeFamily.ID[0] == "F") {
            return (
              <li key={i}>
                <span>{wholeFamily.ID}</span>
              </li>
            );
          }
        })}
      </div>
    </div>
  );
}
