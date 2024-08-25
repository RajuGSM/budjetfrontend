import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highestLowercaseAlphabet', label: 'Highest Lowercase Alphabet' },
  ];

  useEffect(() => {
    document.title = apiResponse ? apiResponse.roll_number : 'Your Roll Number';
  }, [apiResponse]);

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      setError(null);
      setLoading(true);

      const response = await axios.post('http://127.0.0.1:5000/bfhl', { data: parsedJson });
      setApiResponse(response.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      if (e.response) {
        setError(`Error: ${e.response.status} ${e.response.statusText}`);
      } else if (e.request) {
        setError('Network Error: Could not reach the server');
      } else {
        setError('Invalid JSON format');
      }
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected || []);
  };

  const filterResponseData = () => {
    if (!apiResponse) return [];

    const filteredData = [];

    selectedOptions.forEach(option => {
      switch (option.value) {
        case 'alphabets':
          if (Array.isArray(apiResponse.alphabets)) {
            filteredData.push(...apiResponse.alphabets);
          }
          break;
        case 'numbers':
          if (Array.isArray(apiResponse.numbers)) {
            filteredData.push(...apiResponse.numbers);
          }
          break;
        case 'highestLowercaseAlphabet':
          if (Array.isArray(apiResponse.highest_lowercase_alphabet)) {
            filteredData.push(...apiResponse.highest_lowercase_alphabet);
          }
          break;
        default:
          break;
      }
    });

    return filteredData;
  };

  const renderResponse = () => {
    const filteredData = filterResponseData();
    return <pre>{JSON.stringify(filteredData, null, 2)}</pre>;
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Enter JSON String</h1>
      <div className="form-group">
        <textarea 
          className="form-control mb-3" 
          rows="5"
          value={jsonInput} 
          onChange={handleInputChange} 
          placeholder='Enter JSON here (e.g., {"data": ["M", "1"]})'
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={handleSubmit}>
        Submit
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {apiResponse && (
        <>
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            className="mb-3"
          />
          {renderResponse()}
        </>
      )}
    </div>
  );
};

export default App;
