import { inject } from '@vercel/analytics';
inject();

// select marques
const brands = ["Choisir une marque", "Ethiquable", "Milka", "Kaoka", "Kinder", "Bonnat", "Lindt", "Michel-Cluizel"]
const categories = ["Choisir une catégorie", "Snacks", "Chocolats", "Chocolats noirs", "Barres", "Pâtes à tartiner", "Chocolats de Noël"]
const catTrad = ["Choisir une catégorie", "snacks", "chocolates", "dark-chocolates", "bars", "chocolate-spreads", "christmas-chocolates"]

const selectBrands = () => {
	const selectBrand = document.getElementById("brand-select");
	for (let i = 0; i < brands.length; i++) {
		const option = document.createElement("option");
		option.text = brands[i];
		selectBrand.add(option)
	}
}

const selectCategories = () => {
	// select catégorie
	// récupérer le select
	const selectCat = document.getElementById("cat-select");
	// créer une option du select par catégorie
	for (let i = 0; i < categories.length; i++) {
		const option = document.createElement("option");
		option.text = categories[i];
		selectCat.add(option)
	}
}
selectBrands()
selectCategories()


const getValueBrand = () => {
	const selectBrandId = document.getElementById("brand-select");
	const brandChoice = selectBrandId.selectedIndex;
	const brandResult = selectBrandId.options[brandChoice].value;
	return brandResult
}
const getValueCat = () => {
	const selectCatId = document.getElementById("cat-select");
	const catChoice = selectCatId.selectedIndex;
	const catResult = selectCatId.options[catChoice].value;

	//Traduction de la catégorie. Va chercher l'index du tableau categories et va ensuite chercher la traduction dans le tableau catTrad
	const valueCatIndex = categories.indexOf(catResult)
	const catResultTrad = catTrad[valueCatIndex]
	return catResultTrad
}

const affichage = (response) => {
	// Reset de l'affichage précédent
	const listFiches = document.querySelector(".listFiches")
	while (listFiches.firstChild) {
		listFiches.removeChild(listFiches.firstChild);
	}

	// Création des fiches
	for (let i = 0; i < response.length; i++) {
		const article = response[i]

		const fiche = document.createElement("div")
		listFiches.appendChild(fiche)

		const productName = document.createElement("h2")
		productName.textContent = article.product_name_fr
		fiche.appendChild(productName)

		const brand = document.createElement("h3")
		brand.textContent = article.brands
		fiche.appendChild(brand)

		const nutriscoreViz = document.createElement("img")
		const nutriscore = article.nutriscore_grade
		nutriscoreViz.src = `img/nutri_${nutriscore}.png`
		fiche.appendChild(nutriscoreViz)
	}
}

const request = async () => {
	const valueBrand = getValueBrand();
	const valueCat = getValueCat();

	const url = `https://world.openfoodfacts.net/api/v2/search?brands_tags=${valueBrand}&categories_tags=${valueCat}&countries_tags_en=france&fields=brands%2Cproduct_name_fr%2Cnutriscore_grade&sort_by=nutriscore_score`;
	console.log("url = ", url)
	const datas = await fetch(url);
	console.log("datas = ", datas);
	const response = await datas.json();
	// console.log("response = ", response)
	// console.log("response.product =", response.products)

	deleteEmptyElement(response.products)

	//Limiter à 5 réponses
	const responseFive = response.products.slice(0, 5)
	// console.log("5 requêtes = ", responseFive)

	affichage(responseFive)

}

// Si une des catégories est vide ou "unknown", supprime l'élément
const deleteEmptyElement = (data) => {
    for (let i=0; i<data.length; i++) {
        const article = data[i]
        if (article.brands === "" || article.nutriscore_grade === "" || article.nutriscore_grade === "unknown" || article.product_name_fr === "") {
            data.splice(i, 1)
        }
    }
    return data
}