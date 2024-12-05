// Function to sort data by title in ascending order
export const sortByTitleAscending = (data, titleKey = 'title') => {
    // Create a shallow copy of the data array to avoid modifying the original array
    return [...data].sort((a, b) => {
        // Access the title of each item using the provided titleKey, default to 'showTitle' if not found
        const titleA = a[titleKey] || a.showTitle || ''; // Use an empty string if no title is found
        const titleB = b[titleKey] || b.showTitle || ''; // Use an empty string if no title is found

        // Compare the titles using localeCompare, which compares strings in a locale-sensitive manner
        return titleA.localeCompare(titleB);
    });
};

// Function to sort data by title in descending order
export const sortByTitleDescending = (data, titleKey = 'title') => {
    // Create a shallow copy of the data array to avoid modifying the original array
    return [...data].sort((a, b) => {
        // Access the title of each item using the provided titleKey, default to 'showTitle' if not found
        const titleA = a[titleKey] || a.showTitle || ''; // Use an empty string if no title is found
        const titleB = b[titleKey] || b.showTitle || ''; // Use an empty string if no title is found

        // Compare the titles using localeCompare, but reverse the order to sort descending
        return titleB.localeCompare(titleA); // Reverse the comparison to sort in descending order
    });
};

// Function to sort data by date in ascending order
export const sortByDateAscending = (data, dateKey = 'updated') => {
    // Create a shallow copy of the data array to avoid modifying the original array
    return [...data].sort((a, b) => {
        // Convert the date values of each item to Date objects (fallback to 'savedAt' if no date is available)
        const dateA = new Date(a[dateKey] || a.savedAt || 0); // Convert to date, default to '0' (epoch) if missing
        const dateB = new Date(b[dateKey] || b.savedAt || 0); // Convert to date, default to '0' (epoch) if missing

        // Compare the two dates by subtracting them (ascending order)
        return dateA - dateB; // This will sort the dates from earliest to latest (ascending)
    });
};

// Function to sort data by date in descending order
export const sortByDateDescending = (data, dateKey = 'updated') => {
    // Create a shallow copy of the data array to avoid modifying the original array
    return [...data].sort((a, b) => {
        // Convert the date values of each item to Date objects (fallback to 'savedAt' if no date is available)
        const dateA = new Date(a[dateKey] || a.savedAt || 0); // Convert to date, default to '0' (epoch) if missing
        const dateB = new Date(b[dateKey] || b.savedAt || 0); // Convert to date, default to '0' (epoch) if missing

        // Compare the two dates by subtracting them (descending order)
        return dateB - dateA; // This will sort the dates from latest to earliest (descending)
    });
};
