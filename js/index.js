const autoCompleteConfig = {
    renderOption(movie) {
        const movieImg = movie.Poster === "N/A" ? "" : movie.Poster
        return `
                <img src = "${movieImg}" />
                <h2>${movie.Title} (${movie.Year})</h2>
        `
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: "725f76ce",
                s: searchTerm
            }
        })

        if (response.data.Error) {
            return []
        }

        return response.data.Search
    }
}


createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#left-autoComplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden")
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    }
})

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#right-autoComplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden")
        onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    }
})

let rightSide;
let leftSide;

const onMovieSelect = async (movie, targetElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "725f76ce",
            i: movie.imdbID
        }
    })

    targetElement.innerHTML = onMovieTemplate(response.data)

    if (side === "left") {
        leftSide = response.data;
    } else if (side === "right") {
        rightSide = response.data
    }

    if (leftSide && rightSide) {
        runComparison()
    }

}

const runComparison = () => {

    const leftSideStats = document.querySelectorAll("#left-summary .notification")
    const rightSideStats = document.querySelectorAll("#right-summary .notification")

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index]

        const leftSideStatValue = parseFloat(leftStat.dataset.value);
        const rightSideStatValue = parseFloat(rightStat.dataset.value);

        if (rightSideStatValue > leftSideStatValue) {
            rightStat.classList.add("is-primary")
            leftStat.classList.remove("is-primary")
            leftStat.classList.add("is-warning")

        } else if (rightSideStatValue < leftSideStatValue) {
            leftStat.classList.add("is-primary")
            rightStat.classList.remove("is-primary")
            rightStat.classList.add("is-warning")
        } else {
            leftStat.className = 'notification'
            rightStat.className = "notification"
        }
    })


}

const onMovieTemplate = (movieDetail) => {

    const { Title, Poster, Genre, Plot, Awards, BoxOffice, Metascore, imdbRating, imdbVotes } = movieDetail

    const dollars = BoxOffice === "N/A" ? 0 : parseInt(BoxOffice.replace(/\$/g, "").replace(/,/g, ""))
    const metaScore = Metascore === "N/A" ? 0 : parseInt(Metascore)
    const imdbR = imdbRating === "N/A" ? 0 : parseFloat(imdbRating)
    const imdbV = imdbVotes === "N/A" ? 0 : parseInt(imdbVotes.replace(/,/g, ''))

    let countOfAwards = 0;

    Awards.split(" ").forEach((word) => {
        const value = parseInt(word)
        if (isNaN(value)) {
            return;
        } else {
            countOfAwards += value;
        }
    })


    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${Poster}" alt="">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h2>${Title}</h2>
                    <h4>${Genre}</h4>
                    <p>${Plot}</p>
                </div>
            </div>
        </article>
        <article data-value = "${countOfAwards}" class="notification ">
            <p class="title">${Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value = "${dollars}" class="notification ">
            <p class="title">${BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value = "${metaScore}" class="notification ">
            <p class="title">${Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value = "${imdbR}" class="notification ">
            <p class="title">${imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value = "${imdbV}" class="notification ">
            <p class="title">${imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}

document.querySelector("footer #year").innerText = new Date().getFullYear().toString()


document.querySelector(".link-button").addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
    });
})