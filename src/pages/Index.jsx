import React, { useState } from "react";
import { Box, Heading, Input, Button, Select, Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex, Text } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaFilter, FaFileExport } from "react-icons/fa";

const Index = () => {
  const [transactions, setTransactions] = useState([]);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("salary");
  const [filter, setFilter] = useState({ type: "all", category: "all", startDate: "", endDate: "" });
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedTransactions = [...transactions];
      updatedTransactions[editIndex] = { date, amount: parseFloat(amount), type, category };
      setTransactions(updatedTransactions);
      setEditIndex(null);
    } else {
      setTransactions([...transactions, { date, amount: parseFloat(amount), type, category }]);
    }
    setDate("");
    setAmount("");
    setType("income");
    setCategory("salary");
  };

  const handleEdit = (index) => {
    const transaction = transactions[index];
    setDate(transaction.date);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setCategory(transaction.category);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedTransactions = [...transactions];
    updatedTransactions.splice(index, 1);
    setTransactions(updatedTransactions);
  };

  const handleFilter = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = filter.type === "all" || transaction.type === filter.type;
    const matchesCategory = filter.category === "all" || transaction.category === filter.category;
    const matchesStartDate = filter.startDate === "" || transaction.date >= filter.startDate;
    const matchesEndDate = filter.endDate === "" || transaction.date <= filter.endDate;
    return matchesType && matchesCategory && matchesStartDate && matchesEndDate;
  });

  const totalIncome = filteredTransactions.filter((transaction) => transaction.type === "income").reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = filteredTransactions.filter((transaction) => transaction.type === "expense").reduce((sum, transaction) => sum + transaction.amount, 0);

  const balance = totalIncome - totalExpense;

  const exportTransactions = () => {
    const data = JSON.stringify(transactions, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.json";
    link.click();
  };

  return (
    <Box maxWidth="800px" margin="auto" padding="20px">
      <Heading as="h1" size="xl" textAlign="center" marginBottom="20px">
        Budgeting App
      </Heading>
      <form onSubmit={handleSubmit}>
        <Flex gap="10px" marginBottom="20px">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <Input type="number" step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="salary">Salary</option>
            <option value="groceries">Groceries</option>
            <option value="bills">Bills</option>
            <option value="other">Other</option>
          </Select>
          <Button type="submit" colorScheme="blue" leftIcon={<FaPlus />}>
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </Flex>
      </form>
      <Flex gap="10px" marginBottom="20px">
        <Select name="type" value={filter.type} onChange={handleFilter}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
        <Select name="category" value={filter.category} onChange={handleFilter}>
          <option value="all">All Categories</option>
          <option value="salary">Salary</option>
          <option value="groceries">Groceries</option>
          <option value="bills">Bills</option>
          <option value="other">Other</option>
        </Select>
        <Input type="date" name="startDate" value={filter.startDate} onChange={handleFilter} placeholder="Start Date" />
        <Input type="date" name="endDate" value={filter.endDate} onChange={handleFilter} placeholder="End Date" />
        <IconButton icon={<FaFilter />} aria-label="Filter" onClick={() => setFilter({ type: "all", category: "all", startDate: "", endDate: "" })} />
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Amount</Th>
            <Th>Type</Th>
            <Th>Category</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredTransactions.map((transaction, index) => (
            <Tr key={index}>
              <Td>{transaction.date}</Td>
              <Td>{transaction.amount.toFixed(2)}</Td>
              <Td>{transaction.type}</Td>
              <Td>{transaction.category}</Td>
              <Td>
                <IconButton icon={<FaEdit />} aria-label="Edit" onClick={() => handleEdit(index)} marginRight="5px" />
                <IconButton icon={<FaTrash />} aria-label="Delete" onClick={() => handleDelete(index)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justifyContent="space-between" marginTop="20px">
        <Text>
          Total Income: <strong>{totalIncome.toFixed(2)}</strong>
        </Text>
        <Text>
          Total Expense: <strong>{totalExpense.toFixed(2)}</strong>
        </Text>
        <Text>
          Balance: <strong>{balance.toFixed(2)}</strong>
        </Text>
        <Button leftIcon={<FaFileExport />} onClick={exportTransactions}>
          Export
        </Button>
      </Flex>
    </Box>
  );
};

export default Index;
