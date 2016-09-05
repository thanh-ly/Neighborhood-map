var initialCats = [
	{
		clickCount: 0,
		name: 'Tabby',
		imgSrc: 'img/434164568_fea0ad4013_z.jpg',
		imgAttribution: 'https://www.flickr.com',
		nickNames: ["Orange", "Catty", "Poopy"]
	}, {
		clickCount: 0,
		name: 'Meowy',
		imgSrc: 'img/22252709_010df3379e_z.jpg',
		imgAttribution: 'https://www.flickr.com',
		nickNames: ["Grry", "Prancy", "Poopy"]
	}, {
		clickCount: 0,
		name: 'Kitty',
		imgSrc: 'img/1413379559_412a540d29_z.jpg',
		imgAttribution: 'https://www.flickr.com',
		nickNames: ["Loopy", "Woobbly", "Poopy"]
	}, {
		clickCount: 0,
		name: 'Tigery',
		imgSrc: 'img/4154543904_6e2428c421_z.jpg',
		imgAttribution: 'https://www.flickr.com',
		nickNames: ["Meany", "Salty", "Poopy"]
	}, {
		clickCount: 0,
		name: 'Sleepy',
		imgSrc: 'img/9648464288_2516b35537_z.jpg',
		imgAttribution: 'https://www.flickr.com',
		nickNames: ["Zzzzzy", "Lolly", "Poopy"]
	}]

var Cat = function(data) {
	this.clickCount = ko.observable(data.clickCount);
	this.name = ko.observable(data.name);
	this.imgSrc = ko.observable(data.imgSrc);
	this.imgAttribution = ko.observable(data.imgAttribution);
	this.nickNames = ko.observableArray (data.nickNames)


	//this assigns a string that activates when clickCount reaches a certain amount
	this.levels = ko.computed(function() {
		if (this.clickCount() < 10) {
			return "Infant";
		}
		 else if (this.clickCount() < 50) {
			return "Teenager";
		} else {
			return "Adult";
		}
	}, this);
};

var ViewModel = function() {
	var self = this;
	//creates an empty array to store cats
	this.catList = ko.observableArray([]);
	//for each item in the initialCats array, we push into the Cat class, which we push into the catList
	initialCats.forEach(function(catItem) {
		self.catList.push( new Cat(catItem) );
	});
	//then we set the curentCat to the first cat in the catList
	this.currentCat = ko.observable( this.catList()[0] );
	//cat selector
	this.catSelector = function (i) {
		console.log('hi');
		self.currentCat(self.catList()[i()])
		/*  or self.currentCat(clickedCat), where clickedCat is the thing you clicked on (ref dcmentns)
		also needs to be in the outer function(clickedCat) {}. this is the correct code */
	};
	//uses var self
	this.incrementCounter = function () {
		self.currentCat().clickCount(self.currentCat().clickCount() + 1);
	};
	// this.incrementCounter = function () {
	// 	this.clickCount(this.clickCount() + 1);
	// }
	
	//testing the computed observable concat
	//uses var self
	this.nameAndLevels = ko.computed(function() {
		return self.currentCat().clickCount() + " " + self.currentCat().levels();
	});
	// this.nameAndLevels = ko.computed(function() {
	// 	return this.clickCount() + " " + this.levels();
	// },this);
};

ko.applyBindings(new ViewModel());