import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ProfessionSearch.css';

const ProfessionSearch = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [professions, setProfessions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [error, setError] = useState('');

	const searchRef = useRef(null);
	const dropdownRef = useRef(null);

	// Debounce search to avoid too many API calls
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (searchTerm.trim().length > 0) {
				searchProfessions(searchTerm);
			} else {
				setProfessions([]);
				setShowDropdown(false);
			}
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchTerm]);

	const searchProfessions = async (term) => {
		try {
			setIsLoading(true);
			setError('');

			const response = await axios.get(
				`/api/professions?search_term=${encodeURIComponent(term)}`
			);

			if (response.data && response.data.data) {
				setProfessions(response.data.data);
				setShowDropdown(true);
				setSelectedIndex(-1);
			}
		} catch (err) {
			console.error('Search error:', err);
			setError('Failed to fetch professions. Please try again.');
			setProfessions([]);
			setShowDropdown(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSelectProfession = (profession) => {
		setSearchTerm(profession);
		setShowDropdown(false);
		setProfessions([]);
		setSelectedIndex(-1);
	};

	const handleKeyDown = (e) => {
		if (!showDropdown || professions.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < professions.length - 1 ? prev + 1 : 0
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev > 0 ? prev - 1 : professions.length - 1
				);
				break;
			case 'Enter':
				e.preventDefault();
				if (selectedIndex >= 0) {
					handleSelectProfession(professions[selectedIndex]);
				}
				break;

			default:
				break;
		}
	};

	// Close dropdown only on Escape key or when option is selected
	useEffect(() => {
		const handleKeydown = (event) => {
			if (event.key === 'Escape') {
				setShowDropdown(false);
				setSelectedIndex(-1);
			}
		};

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	}, []);

	return (
		<div className="profession-search">
			<div className="search-container">
				<div className="search-input-wrapper">
					<input
						ref={searchRef}
						type="text"
						value={searchTerm}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						placeholder="Start typing profession name..."
						className="search-input"
						autoComplete="off"
					/>
					{isLoading && (
						<div className="loading-spinner">
							<div className="spinner"></div>
						</div>
					)}
				</div>

				{error && <div className="error-message">{error}</div>}

				{showDropdown && professions.length > 0 && (
					<div ref={dropdownRef} className="dropdown">
						{professions.map((profession, index) => (
							<div
								key={index}
								className={`dropdown-item ${
									index === selectedIndex ? 'selected' : ''
								}`}
								onClick={() => handleSelectProfession(profession)}
								onMouseEnter={() => setSelectedIndex(index)}
							>
								{profession}
							</div>
						))}
					</div>
				)}

				{showDropdown &&
					professions.length === 0 &&
					!isLoading &&
					searchTerm.trim() && (
						<div className="dropdown">
							<div className="dropdown-item no-results">
								No professions found
							</div>
						</div>
					)}
			</div>
		</div>
	);
};

export default ProfessionSearch;
