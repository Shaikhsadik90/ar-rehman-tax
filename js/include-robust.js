function loadComponent(id, file) {
	const element = document.getElementById(id);
	if (!element) {
		console.warn(`Element with id '${id}' not found. Skipping component load for ${file}`);
		return Promise.resolve();
	}
	
	// Try multiple path variations for better deployment compatibility
	const paths = [
		file,                    // relative path: components/banner.html
		'/' + file,              // absolute path: /components/banner.html
		'./' + file,             // explicit relative: ./components/banner.html
		window.location.origin + '/' + file  // full URL
	];
	
	let pathIndex = 0;
	
	function tryNextPath() {
		if (pathIndex >= paths.length) {
			console.error(`Failed to load component '${file}' with all attempted paths`);
			element.innerHTML = `<!-- Component ${file} failed to load -->`;
			return Promise.reject(new Error(`Component ${file} not found`));
		}
		
		const currentPath = paths[pathIndex++];
		
		return fetch(currentPath)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status} for path: ${currentPath}`);
				}
				return response.text();
			})
			.then(data => {
				if (data.trim()) {
					element.innerHTML = data;
					console.log(`Successfully loaded component: ${currentPath}`);
					return data;
				} else {
					throw new Error(`Empty response for: ${currentPath}`);
				}
			})
			.catch(error => {
				console.warn(`Failed to load ${currentPath}:`, error.message);
				return tryNextPath();
			});
	}
	
	return tryNextPath();
}

// Backup XMLHttpRequest method for environments where fetch might not work properly
function loadComponentXHR(id, file) {
	const element = document.getElementById(id);
	if (!element) {
		console.warn(`Element with id '${id}' not found. Skipping component load for ${file}`);
		return Promise.resolve();
	}
	
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					element.innerHTML = xhr.responseText;
					console.log(`Successfully loaded component (XHR): ${file}`);
					resolve(xhr.responseText);
				} else {
					console.error(`Failed to load component (XHR): ${file}, status: ${xhr.status}`);
					element.innerHTML = `<!-- Component ${file} failed to load -->`;
					reject(new Error(`XHR failed: ${xhr.status}`));
				}
			}
		};
		xhr.open('GET', file, true);
		xhr.send();
	});
}

// Enhanced component loading with multiple fallback strategies
function enhancedLoadComponent(id, file) {
	// First try fetch API
	return loadComponent(id, file)
		.catch(error => {
			console.warn(`Fetch failed for ${file}, trying XMLHttpRequest...`);
			// Fallback to XMLHttpRequest
			return loadComponentXHR(id, file);
		})
		.catch(error => {
			console.error(`All loading methods failed for ${file}:`, error);
			const element = document.getElementById(id);
			if (element) {
				element.innerHTML = `<!-- Component ${file} failed to load -->`;
			}
		});
}

// Load all components with multiple strategies
function initializeComponents() {
	const componentsToLoad = [
		{ id: "banner", file: "components/banner.html" },
		{ id: "navbar", file: "components/navbar.html" },
		{ id: "footer", file: "components/footer.html" },
		{ id: "HomeBanner", file: "components/HomeBanner.html" }
	];
	
	// Load components with enhanced error handling
	Promise.allSettled(
		componentsToLoad.map(comp => enhancedLoadComponent(comp.id, comp.file))
	).then(results => {
		const successful = results.filter(r => r.status === 'fulfilled').length;
		const failed = results.filter(r => r.status === 'rejected').length;
		console.log(`Component loading complete: ${successful} successful, ${failed} failed`);
		
		// If all failed, there might be a fundamental issue
		if (failed === componentsToLoad.length) {
			console.error('All component loading failed. This might indicate a server configuration issue.');
		}
	});
}

// Multiple initialization strategies for different environments
function initialize() {
	// Strategy 1: Immediate execution if DOM is already ready
	if (document.readyState === 'loading') {
		// DOM not ready yet
		document.addEventListener('DOMContentLoaded', initializeComponents);
	} else {
		// DOM already ready
		initializeComponents();
	}
	
	// Strategy 2: Backup timer-based loading (for problematic environments)
	setTimeout(() => {
		// Check if components are loaded, if not, try again
		const banner = document.getElementById('banner');
		if (banner && banner.innerHTML.trim() === '') {
			console.warn('Components not loaded after 2 seconds, retrying...');
			initializeComponents();
		}
	}, 2000);
}

// Initialize the component loading
initialize();

// Scroll to top
window.scrollTo(0, 0);
