import { useState, useEffect } from 'react';

const App = () => {
  const [message, setMessage] = useState(null);
  const [value, setValue] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
          message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch("http://localhost:8000/completions", options);
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }

  }

  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPrevChats(prevChats => (
        [...prevChats, 
          {
            title: currentTitle,
            role: "user",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
  }, [message, currentTitle]);

  console.log(prevChats);

  const currentChat = prevChats.filter(prevChat => prevChat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(prevChats.map(prevChat => prevChat.title)));
  console.log(uniqueTitles);

  return (
    <div className = "app">
      <section className = "side-bar">
        <button onClick = {createChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key = {index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>Made by Renata</nav>
      </section>

      <section className = "main">
        <h1>RenataGPT</h1>
        <ul className = "feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className = "role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className = "bottom-section">
          <div className = "input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id = "submit" onClick={getMessages}>➢</div>
          </div>

          <p className = "info">
            RenataGPT is a clone of chatGPT. It was created to learn how to use the openAP api.
            All inspo credits to openAI.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
