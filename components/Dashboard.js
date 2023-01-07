import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import styles from "../styles/Dashboard.module.css";

function Dashboard() {
  const [mahasiswa, setMahasiswa] = useState([]);

  // delete handler
  const deleteHandler = async (e, NIM) => {
    e.preventDefault();
    console.log(NIM);
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .delete(`http://localhost:8000/api/mahasiswa/${NIM}`)
      .then((response) => {
        console.log(response);
        fetchDataMahasiswa();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // fetch data user
  const fetchDataMahasiswa = async () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios.get("http://localhost:8000/api/mahasiswa").then((response) => {
      setMahasiswa(response.data.data);
    });
  };

  useEffect(() => {
    fetchDataMahasiswa();
  }, []);

  return (
    <>
      <h1 className={styles.heading} style={{ fontWeight: "500" }}>
        Dashboard
      </h1>

      <div className={styles.tableContainer}>
        {mahasiswa.map((item) => (
          <Card key={item?.NIM}>
            <a
              href={"/detail"}
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={
                  "https://pbs.twimg.com/profile_images/1537677628039380992/i3uUfk-Z_400x400.jpg"
                }
                style={{ width: "50px", height: "50px", borderRadius: "100px" }}
              />
              <Name>
                <span>{item?.nama}</span> | {item?.NIM}
              </Name>
            </a>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                className={styles.btn}
                style={{ background: "#FDF8EF", color: "#F6D35C" }}
              >
                Edit
              </button>
              <button
                className={styles.btn}
                style={{ background: "#FFECF2", color: "#E44A79" }}
                onClick={(e) => {
                  deleteHandler(e, item?.NIM);
                }}
              >
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

export default Dashboard;

const Card = styled.div`
  background: #fff;
  padding: 20px;
  margin: 20px 30px 0 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  border-radius: 10px;
  cursor: pointer;
`;

const Name = styled.h2`
  padding: 0 15px;
  margin: 0 0 0 0;
  font-size: 1rem;
  font-weight: 400;
  color: #080808;

  span {
    font-weight: 500;
  }
`;
