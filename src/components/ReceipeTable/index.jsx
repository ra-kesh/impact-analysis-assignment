import React from "react";
import { useExpanded, useSortBy, useTable, useGroupBy } from "react-table";

const ReceipeTable = ({ columns, data, sortBy }) => {
  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    rows,
    prepareRow,
    setSortBy,
  } = useTable(
    {
      columns,
      data,
      initialState: { sortBy },
    },
    useGroupBy,
    useSortBy,
    useExpanded
  );

  return (
    <>
      <table {...getTableProps}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  onClick={() => {
                    //set sort desc, aesc or none?
                    const desc =
                      column.isSortedDesc === true
                        ? undefined
                        : column.isSortedDesc === false
                        ? true
                        : false;
                    if (column.id === "price" || column.id === "name") {
                      setSortBy([{ id: column.id, desc }, ...sortBy]);
                    }
                  }}
                >
                  {column.canGroupBy && column.id === "category" ? (
                    <span {...column.getGroupByToggleProps()}>
                      {column.isGrouped ? "+" : "-"}
                    </span>
                  ) : null}

                  {column.render("Header")}

                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? "-" : "+"}
                          </span>{" "}
                          {cell.render("Cell")} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render("Aggregated")
                      ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        cell.render("Cell")
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ReceipeTable;
