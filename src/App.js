import "./App.css";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ReceipeTable from "./components/ReceipeTable";

function App() {
  const [receipes, setReceipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReceipes = async () => {
    setLoading(true);
    try {
      const { data } = await axios(
        "https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json"
      );

      setReceipes(data);
      setLoading(false);
    } catch (error) {
      setReceipes([]);
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipes();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Label",
        accessor: "label",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Description",
        accessor: "description",
      },
    ],

    []
  );

  return (
    <div className="App">
      {loading ? (
        <h2>loading...</h2>
      ) : (
        <ReceipeTable columns={columns} data={receipes} />
      )}
    </div>
  );
}

export default App;
