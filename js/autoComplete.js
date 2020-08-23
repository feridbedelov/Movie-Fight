const createAutoComplete = (config) => {
    const { root, renderOption, onOptionSelect, inputValue, fetchData } = config;

    root.innerHTML = `
        <label><b>Search for a movie to compare </b></label>
        <input placeholder = "Search Movie" class = "input"  />
        <div class="dropdown">
            <div class = "dropdown-menu">
                <div class = "dropdown-content results"></div>
            </div>
        </div>
    `

    const input = root.querySelector(".input")
    const dropdown = root.querySelector(".dropdown")
    const results = root.querySelector(".results")

    const onInput = async (e) => {

        // will be fetching the items which we look for
        const items = await fetchData(e.target.value);

        // if there is no items matching the search term then results dropdown will be closed
        if (items.length <= 0) {
            dropdown.classList.remove("is-active");
            return;
        }

        // will clear the previous  results  before adding new items 
        results.innerHTML = ""

        // and will open dropdown of results
        dropdown.classList.add("is-active")

        // will loop the all items and create a new item and add it to the results array
        for (const item of items) {

            // create item element and add dropdown-item class
            const option = document.createElement("a")
            option.classList.add("dropdown-item")

            option.innerHTML = renderOption(item)

            // add the event listener to each movie
            option.addEventListener("click", (e) => {
                // will close results dropdown
                dropdown.classList.remove("is-active")

                // update the input value to selected item
                input.value = inputValue(item);

                // call the helper function to fetch item , get data and render it 
                onOptionSelect(item);
            })
            results.appendChild(option)
        }
    }


    // Event Listeners

    input.addEventListener("input", debounce(onInput,500))

    document.addEventListener("click", (e) => {
        if (!root.contains(e.target)) {
            dropdown.classList.remove("is-active")
        }
    })

}