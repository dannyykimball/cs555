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
        <header>
          CS 555 Sprint 4
          <div className="subbbTitleRow">
            Adham Abdelwahab, Quinn Corcoran, Daniel Kimball
          </div>
        </header>

        <h3> Loading... </h3>
      </div>
    );
  }

  return (
    <div>
      <header>
        CS 555 Sprint 4
        <div className="subbbTitleRow">
          Adham Abdelwahab, Quinn Corcoran, Daniel Kimball
        </div>
      </header>

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
        {family.map((familyMember) => {
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
        <div className="titleRow"> Families List </div>
        <div className="subTitleRow">
          <div className="col2">ID</div>
          <div className="col2">HusbID</div>
          <div className="col2">HusbName</div>
          <div className="col2">WifeID</div>
          <div className="col2">WifeName</div>
          <div className="col2">Children</div>
        </div>
        {family.map((wholeFamily) => {
          if (wholeFamily.ID[0] == "F") {
            return (
              <li className="row">
                <div className="col2">{wholeFamily.ID}</div>
                <div className="col2">{wholeFamily.HusbID}</div>
                <div className="col2">{wholeFamily.HusbName}</div>
                <div className="col2">{wholeFamily.WifeID}</div>
                <div className="col2">{wholeFamily.WifeName}</div>
                <div className="col2">{wholeFamily.Children}</div>
              </li>
            );
          }
        })}
      </div>
    </div>
  );
}
