import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import styles from "../styles/Dashboard.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { SentimentSatisfiedAltSharp } from "@mui/icons-material";

function Dashboard() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mahasiswaDetail, setMahasiswaDetail] = useState([]);
  const [hide, setHide] = useState(true);
  const [editHide, setEditHide] = useState(true);
  const [detailHide, setDetailHide] = useState(true);
  const [fakultas, setFakultas] = useState([]);
  const [validation, setValidation] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [fakultasForDetail, setFakultasForDetail] = useState([]);
  const [prodiForDetail, setProdiForDetail] = useState([]);

  const BASE_URL = process.env.NEXT_PUBLIC_BE;

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
      .get(`${BASE_URL}/fakultas`)
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
      .get(`${BASE_URL}/prodi`)
      .then((response) => {
        setProgramStudi(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // confirm delete
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

  // clear data
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
      .delete(`${BASE_URL}/mahasiswa/${NIM}`)
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
      .post(`${BASE_URL}/mahasiswa`, formData)
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

  // fetch data mahasiswa detail
  const fetchDataMahasiswaDetail = async (NIM) => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios.get(`${BASE_URL}/mahasiswa/${NIM}`).then((response) => {
      setMahasiswaDetail(response.data.data[0]);
      setFakultasForDetail(response.data.data[0]?.fakultas[0]);
      setProdiForDetail(response.data.data[0]?.prodi[0]);
    });
  };

  // detail handler
  const detailHandler = async (e, NIM) => {
    e.preventDefault();
    fetchDataMahasiswaDetail(NIM);
    setDetailHide(false);
  };

  // edit handler
  const editHandler = async (e, NIM) => {
    e.preventDefault();
    fetchDataMahasiswaDetail(NIM);
    setEditHide(false);
  };

  // edit data
  const editHandlerData = async (NIM) => {
    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("email", email);
    formData.append("NIM", NIM);
    formData.append("semester", semester);
    formData.append("jenis_kelamin", jenisKelamin);
    formData.append("angkatan", angkatan);
    formData.append("fakultas_id", fakultasId);
    formData.append("prodi_id", prodiId);

    console.log(NIM);

    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await axios
      .post(`${BASE_URL}/mahasiswa/${NIM}`, formData)
      .then((response) => {
        setEditHide(true);
        clearData();
        Swal.fire(
          "Success!",
          "Data Mahasiswa Updated Successfully!",
          "success"
        );
        fetchDataMahasiswa();
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response.data);
        setValidation(error.response.data);
      });
  };

  // fetch data user
  const fetchDataMahasiswa = async () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios.get(`${BASE_URL}/mahasiswa`).then((response) => {
      setMahasiswa(response.data.data);
    });
  };

  useEffect(() => {
    fetchDataMahasiswa();
    fetchDataFakultas();
    fetchDataProgramStudi();
    fetchDataMahasiswaDetail;
  }, []);

  return (
    <>
      <h1 className={styles.heading} style={{ fontWeight: "500" }}>
        Dashboard
      </h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className={styles.tableContainer}
          style={{
            width: "15rem",
            marginRight: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ color: "#020b2a" }}>Jumlah Mahasiswa</span>
          <span
            style={{ fontSize: "3.5rem", color: "#83D887", fontWeight: "500" }}
          >
            {mahasiswa?.length}
          </span>
        </div>
        <div
          className={styles.tableContainer}
          style={{
            width: "15rem",
            marginRight: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ color: "#020b2a" }}>Jumlah Fakultas</span>
          <span
            style={{ fontSize: "3.5rem", color: "#83D887", fontWeight: "500" }}
          >
            {fakultas?.length}
          </span>
        </div>
        <div
          className={styles.tableContainer}
          style={{
            width: "15rem",
            marginRight: "15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span style={{ color: "#020b2a" }}>Jumlah Prodi</span>
          <span
            style={{ fontSize: "3.5rem", color: "#83D887", fontWeight: "500" }}
          >
            {programStudi?.length}
          </span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <h1
          className={styles.heading}
          style={{ fontWeight: "500", fontSize: "2rem", marginLeft: "2rem" }}
        >
          🎓 Data Mahasiswa
        </h1>

        <div
          style={{
            background: "#f5f5f5",
            height: "1px",
            marginTop: "1rem",
            marginBottom: "1.5rem",
            marginLeft: "2rem",
            marginRight: "2rem",
          }}
        ></div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <button
            className={styles.btn}
            style={{
              background: "#DDEDFF",
              color: "#288BFF",
              marginLeft: "2rem",
              marginTop: "0rem",
            }}
            onClick={(e) => setHide(false)}
          >
            Tambah Data Mahasiswa
          </button>

          <form
            action=""
            style={{
              background: "white",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              borderRadius: "10px",
              marginRight: "2rem",
              width: "250px",
              height: "40px",
            }}
          >
            <span style={{ marginLeft: "6px", marginTop: "5px" }}>
              <SearchIcon style={{ color: "#c2c2c2" }} />
            </span>

            <input
              className={styles.input2}
              type="text"
              placeholder="Masukkan Nama/NIM/Jurusan"
              value={keyword}
              style={{ marginLeft: "3px" }}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
        </div>

        {mahasiswa
          .filter((value) => {
            if (keyword === "") {
              return value;
            } else if ((value?.NIM).includes(keyword)) {
              return value;
            } else if (
              (value?.nama).toLowerCase().includes(keyword.toLowerCase())
            ) {
              return value;
            } else if (
              (value?.prodi[0]?.program_studi)
                .toLowerCase()
                .includes(keyword.toLowerCase())
            ) {
              return value;
            }
          })
          .map((item) => (
            <Card key={item?.NIM}>
              <div
                onClick={(e) => detailHandler(e, item?.NIM)}
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src={
                    "https://pbs.twimg.com/profile_images/1537677628039380992/i3uUfk-Z_400x400.jpg"
                  }
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "100px",
                  }}
                />
                <Name>
                  <span>{item?.nama}</span> | {item?.NIM} |{" "}
                  {item?.prodi[0]?.program_studi}
                </Name>
              </div>
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
                  onClick={(e) => editHandler(e, item?.NIM)}
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

      {!detailHide && (
        <div className={styles.container}>
          <div
            className={styles.cookiesContent}
            style={{
              paddingTop: "30px",
              paddingBottom: "30px",
              position: "relative",
            }}
            id="cookiesPopup"
          >
            <button
              className={styles.close}
              style={{ position: "absolute", top: "50px" }}
              onClick={(e) => setDetailHide(true)}
            >
              ✖
            </button>
            <img
              src={
                "https://pbs.twimg.com/profile_images/1537677628039380992/i3uUfk-Z_400x400.jpg"
              }
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "100px",
                marginBottom: "5px",
              }}
            />
            <Name>
              <span>{mahasiswaDetail?.nama}</span>
            </Name>
            <Name style={{ fontSize: "13px" }}>{mahasiswaDetail?.NIM}</Name>
            <span
              style={{
                background: "#f5f5f5",
                height: "1px",
                width: "100%",
                marginTop: "5px",
              }}
            ></span>
            <Card style={{ width: "100%", padding: "10px" }}>
              <span style={{ fontSize: "13px" }}>
                <span style={{ fontWeight: "500" }}>Nama : </span>
                {mahasiswaDetail?.nama}
              </span>
            </Card>

            <Card style={{ width: "100%", padding: "10px" }}>
              <span style={{ fontSize: "13px" }}>
                <span style={{ fontWeight: "500" }}>NIM : </span>
                {mahasiswaDetail?.NIM}
              </span>
            </Card>

            <Card style={{ width: "100%", padding: "10px" }}>
              <span style={{ fontSize: "13px" }}>
                <span style={{ fontWeight: "500" }}>Email : </span>
                {mahasiswaDetail?.email}
              </span>
            </Card>

            <Card style={{ width: "100%", padding: "10px" }}>
              <span style={{ fontSize: "13px" }}>
                <span style={{ fontWeight: "500" }}>Semester : </span>
                {mahasiswaDetail?.semester}
              </span>
            </Card>

            <Card style={{ width: "100%", padding: "10px" }}>
              <span style={{ fontSize: "13px" }}>
                <span style={{ fontWeight: "500" }}>Angkatan : </span>
                {mahasiswaDetail?.angkatan}
              </span>
            </Card>

            <Card style={{ width: "100%", padding: "10px" }}>
              <span style={{ fontSize: "13px" }}>
                <span style={{ fontWeight: "500" }}>Jenis Kelamin : </span>
                {mahasiswaDetail?.jenis_kelamin}
              </span>
            </Card>

            <Card style={{ width: "100%", padding: "10px" }}>
              <span style={{ fontSize: "13px" }}>
                <span style={{ fontWeight: "500" }}>Program Studi : </span>
                {prodiForDetail?.program_studi}
              </span>
            </Card>

            <Card style={{ width: "100%", padding: "10px" }}>
              <span style={{ fontSize: "13px" }}>
                <span style={{ fontWeight: "500" }}>Fakultas : </span>
                {fakultasForDetail?.fakultas}
              </span>
            </Card>
          </div>
        </div>
      )}

      {!editHide && (
        <div className={styles.container}>
          <div className={styles.cookiesContent} id="cookiesPopup">
            <button className={styles.close} onClick={(e) => setEditHide(true)}>
              ✖
            </button>
            <img
              src={
                "https://pbs.twimg.com/profile_images/1537677628039380992/i3uUfk-Z_400x400.jpg"
              }
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "100px",
                marginBottom: "5px",
              }}
            />
            <form action="" className={styles.form}>
              <input
                className={styles.input}
                type="text"
                placeholder="Masukkan Nama"
                defaultValue={mahasiswaDetail.nama}
                onChange={(e) => setNama(e.target.value)}
              />
              <input
                className={styles.input}
                type="email"
                placeholder="Masukkan Email"
                defaultValue={mahasiswaDetail.email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Masukkan NIM"
                defaultValue={mahasiswaDetail.NIM}
                onChange={(e) => setNIM(e.target.value)}
                readOnly
                style={{ background: "#f7f7f9" }}
              />
              <input
                className={styles.input}
                type="number"
                placeholder="Masukkan Semester"
                defaultValue={mahasiswaDetail.semester}
                onChange={(e) => setSemester(e.target.value)}
                required
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Masukkan Angkatan"
                defaultValue={mahasiswaDetail.angkatan}
                onChange={(e) => setAngkatan(e.target.value)}
              />
              <select
                className={styles.input}
                style={{ paddingRight: "2rem" }}
                defaultValue={mahasiswaDetail.jenis_kelamin}
                onChange={(e) => setJenisKelamin(e.target.value)}
              >
                <option value={""}>Pilih Jenis Kelamin</option>
                <option value={"Pria"}>Pria</option>
                <option value={"Wanita"}>Wanita</option>
              </select>
              <select
                className={styles.input}
                style={{ paddingRight: "2rem" }}
                defaultValue={fakultasForDetail?.id}
                value={fakultasId}
                onChange={(e) => setFakultasId(e.target.value)}
              >
                <option key={-1} value={-1}>
                  Pilih Fakultas
                </option>
                {fakultas?.map((item) => (
                  <option
                    key={item?.id}
                    value={item?.id}
                    // selected={
                    //   mahasiswaDetail?.fakultas_id == item?.id
                    //     ? "true"
                    //     : "false"
                    // }
                  >
                    {item?.fakultas}
                  </option>
                ))}
              </select>
              <select
                className={styles.input}
                style={{ paddingRight: "2rem" }}
                defaultValue={prodiForDetail?.id}
                value={prodiId}
                onChange={(e) => setProdiId(e.target.value)}
              >
                <option key={-1} value={-1}>
                  Pilih Program Studi
                </option>
                {programStudi?.map((item) => (
                  <option
                    key={item?.id}
                    value={item?.id}
                    // selected={
                    //   mahasiswaDetail?.prodi_id == item?.id ? "true" : "false"
                    // }
                  >
                    {item?.program_studi}
                  </option>
                ))}
              </select>
            </form>
            <button
              className={styles.accept}
              onClick={(e) => editHandlerData(mahasiswaDetail?.NIM)}
            >
              Edit Data
            </button>
          </div>
        </div>
      )}

      {!hide && (
        <div className={styles.container}>
          <div className={styles.cookiesContent} id="cookiesPopup">
            <button className={styles.close} onClick={(e) => setHide(true)}>
              ✖
            </button>
            <Name style={{ marginTop: "-20px", marginBottom: "20px" }}>
              <span>Tambah Data Mahasiswa</span>
            </Name>
            <form action="" className={styles.form}>
              <input
                className={styles.input}
                type="text"
                placeholder="Masukkan Nama"
                value={nama}
                onChange={(e) =>
                  e.target.value == null
                    ? setNama(e.target.defaultValue)
                    : setNama(e.target.value)
                }
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
  width: 1005;
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
