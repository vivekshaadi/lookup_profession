import React from 'react';
import ProfessionSearch from './components/ProfessionSearch';
import './App.css';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<h1>Profession Lookup</h1>
				<p>Start typing to search for professions</p>
			</header>
			<main className="App-main">
				<ProfessionSearch />
			</main>
		</div>
	);
}

export default App;
