import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import styles from "../styles/Dashboard.module.css";

function Dashboard() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [hide, setHide] = useState(true);
  const [fakultas, setFakultas] = useState([]);
  const [validation, setValidation] = useState([]);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [NIM, setNIM] = useState("");
  const [semester, setSemester] = useState(null);
  const [angkatan, setAngkatan] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [fakultasId, setFakultasId] = useState(null);
  const [prodiId, setProdiId] = useState(null);

  const [programStudi, setProgramStudi] = useState([]);

  const fetchDataFakultas = async () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .get(`http://localhost:8000/api/fakultas`)
      .then((response) => {
        setFakultas(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchDataProgramStudi = async () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .get(`http://localhost:8000/api/prodi`)
      .then((response) => {
        setProgramStudi(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDelete = (e, NIM) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9599A6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteHandler(e, NIM);
        Swal.fire("Deleted!", "Data Mahasiswa has been deleted.", "success");
      }
    });
  };

  const clearData = () => {
    setNama("");
    setEmail("");
    setFakultasId(null);
    setProdiId(null);
    setSemester(null);
    setAngkatan("");
    setNIM("");
    setJenisKelamin("");
  };

  // delete handler
  const deleteHandler = async (e, NIM) => {
    e.preventDefault();
    console.log(NIM);
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .delete(`http://localhost:8000/api/mahasiswa/${NIM}`)
      .then((response) => {
        fetchDataMahasiswa();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // create handler
  const createHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("email", email);
    formData.append("NIM", NIM);
    formData.append("semester", semester);
    formData.append("jenis_kelamin", jenisKelamin);
    formData.append("angkatan", angkatan);
    formData.append("fakultas_id", fakultasId);
    formData.append("prodi_id", prodiId);

    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await axios
      .post("http://localhost:8000/api/mahasiswa", formData)
      .then((response) => {
        setHide(true);
        clearData();
        Swal.fire("Success!", "Data Mahasiswa Added Successfully!", "success");
        fetchDataMahasiswa();
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response.data);
        setValidation(error.response.data);
      });
  };

  // update handler
  const updateHandler = async (e, NIM) => {
    e.preventDefault();
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
    fetchDataFakultas();
    fetchDataProgramStudi();
  }, []);

  console.log(programStudi);
  console.log(fakultasId);

  return (
    <>
      <h1 className={styles.heading} style={{ fontWeight: "500" }}>
        Dashboard
      </h1>

      <div className={styles.tableContainer}>
        <button
          className={styles.btn}
          style={{
            background: "#DDEDFF",
            color: "#288BFF",
            marginLeft: "1.5rem",
          }}
          onClick={(e) => setHide(false)}
        >
          Tambah Data Mahasiswa
        </button>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
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
                  confirmDelete(e, item?.NIM);
                }}
              >
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>

      {!hide && (
        <div className={styles.container}>
          <div className={styles.cookiesContent} id="cookiesPopup">
            <button className={styles.close} onClick={(e) => setHide(true)}>
              ✖
            </button>
            <form action="" className={styles.form}>
              <input
                className={styles.input}
                type="text"
                placeholder="Masukkan Nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
              <input
                className={styles.input}
                type="email"
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Masukkan NIM"
                value={NIM}
                onChange={(e) => setNIM(e.target.value)}
              />
              <input
                className={styles.input}
                type="number"
                placeholder="Masukkan Semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Masukkan Angkatan"
                value={angkatan}
                onChange={(e) => setAngkatan(e.target.value)}
              />
              <select
                className={styles.input}
                style={{ paddingRight: "2rem" }}
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value)}
              >
                <option value={""}>Pilih Jenis Kelamin</option>
                <option value={"Pria"}>Pria</option>
                <option value={"Wanita"}>Wanita</option>
              </select>
              <select
                className={styles.input}
                style={{ paddingRight: "2rem" }}
                value={fakultasId}
                onChange={(e) => setFakultasId(e.target.value)}
              >
                <option key={-1} value={-1}>
                  Pilih Fakultas
                </option>
                {fakultas?.map((item) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.fakultas}
                  </option>
                ))}
              </select>
              <select
                className={styles.input}
                style={{ paddingRight: "2rem" }}
                value={prodiId}
                onChange={(e) => setProdiId(e.target.value)}
              >
                <option key={-1} value={-1}>
                  Pilih Program Studi
                </option>
                {programStudi?.map((item) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.program_studi}
                  </option>
                ))}
              </select>
            </form>
            <button className={styles.accept} onClick={createHandler}>
              Tambah Data
            </button>
          </div>
        </div>
      )}
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
  transition: 0.3s all;

  &:hover {
    background: #f7f7f9;
  }
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
