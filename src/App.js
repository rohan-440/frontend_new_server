import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [alpha, setAlpha] = useState([]);
  const [high, setHigh] = useState([]);
  const [dataToShow, setdataToShow] = useState({});

  // Set website title to roll number
  document.title = 'RA2111043010033';

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      setError('');

      // Make the API call
      const apiResponse = await axios.post('https://bajajfinserv-hjs8h79u.b4a.run/bfhl', parsedJson);
      //debugger
      setResponse(apiResponse.data);
      setFilteredData([apiResponse.data]); // Store the unfiltered response data

      setNumbers(apiResponse.data.numbers || [])
      setAlpha(apiResponse.data.alphabets || [])
      setHigh(apiResponse.data.highest_alphabet || [])

      setdataToShow({})

      console.log(filteredData)
    } catch (err) {
      setError('Invalid JSON input');
    }
  };

  const handleOptionChange = (options) => {

    const data = response
    if (!data) return;

    setdataToShow({})
    let newdata = {}
    options.forEach((opt) => {

      if (opt.value === "alphabets") {
        newdata["alphabets"] = alpha
      } else if (opt.value === "numbers") {
        newdata["numbers"] = numbers
      } else {
        newdata["highest_alphabet"] = high
      }

    });

    setdataToShow(newdata);
    setFilteredData([]);
  };

  const selectOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest', label: 'Highest Alphabet' },
  ];

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4" style={{ color: '#007bff' }}>API Input</h1>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="form-group">
            <textarea
              value={jsonInput}
              onChange={handleJsonChange}
              placeholder='Enter JSON here For eg : {"data" : ["M","1","334","B"]}'
              className="form-control mb-3"
              style={{ borderRadius: '.25rem', border: '1px solid #ced4da' }}
            />
            <button onClick={handleSubmit} className="btn btn-primary btn-block" style={{ borderRadius: '.25rem' }}>Submit</button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>
          <div className="mt-4">
            <h3>Multi Filter</h3>
            <Select
              isMulti
              options={selectOptions}
              onChange={handleOptionChange}
              placeholder="Select options"
              className="mb-4"
            />
            <div>
              {JSON.stringify(dataToShow, null, 2)}
            </div>
          </div>
          <div className="mt-4">
            {response && (
              <div>
                <h3>Filtered Response:</h3>
                {JSON.stringify(response, null, 2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;