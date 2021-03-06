import "./App.css";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ReceipeTable from "./components/ReceipeTable";

function App() {
  const [receipes, setReceipes] = useState([]);

  const [originalData, setOriginalData] = useState([]);

  const fetchReceipes = async () => {
    try {
      const { data } = await axios(
        "https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json"
      );
      setReceipes(data);
      setOriginalData(data);
    } catch (error) {
      setReceipes([]);
      console.log(error);
    }
  };

  useEffect(() => {
    const receipesInLocalStorage = window.localStorage.getItem("receipes");

    if (receipesInLocalStorage) {
      console.log(receipesInLocalStorage);
      setReceipes(JSON.parse(receipesInLocalStorage));
    } else {
      fetchReceipes();
    }
  }, []);

  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateReceipesData,
  }) => {
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
      setValue(e.target.value);
    };

    const onBlur = () => {
      updateReceipesData(index, id, value);
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return <input value={value} onChange={onChange} onBlur={onBlur} />;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },

      {
        Header: "Label",
        accessor: "label",
      },
      {
        Header: "Price",
        accessor: "price",
        aggregate: "average",
        Aggregated: ({ value }) => `${Math.round(value * 100) / 100} (avg)`,
        Cell: EditableCell,
      },
      {
        Header: "Description",
        accessor: "description",
      },
    ],

    []
  );

  const sortBy = [{ id: "price" }, { id: "name" }];

  const updateReceipesData = (rowIndex, columnId, value) => {
    setReceipes((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const resetData = () => {
    setReceipes(originalData);
    window.localStorage.removeItem("receipes");
  };

  return (
    <div className="App">
      <>
        <div className="table">
          <ReceipeTable
            columns={columns}
            data={receipes}
            sortBy={sortBy}
            updateReceipesData={updateReceipesData}
          />
        </div>
        <button
          onClick={() => {
            window.localStorage.setItem("receipes", JSON.stringify(receipes));
          }}
        >
          save
        </button>
        <button onClick={resetData}>Reset Data</button>
      </>
    </div>
  );
}

export default App;
