var tableMock = {
	/* column header -> column data. Should each be same lenght */
	data : {
		id : [
			"261",
			"227",
			"246",
			"212"
		],
		name : [
			"Jack Considine",
			"David Brent",
			"Michael Scott",
			"Dwide Shrude"
		],
		description : [
			"Ardent viewer of the show",
			"British equivalent of Michael Scott. Dryer humor, more cringeworthy, and often times more deriding",
			"Not at all afraid to make a fool of himself. Catch phrases include : 'He had no arms or legs. He couldn't see speak or here. And this is how he led a nation",
			"Remarkable character development, from kisass in early seasons (and frankly kind of a nitwit) to more of an evil-ish mastermind"
		]

	},
	/* Indicates whether returned data will have bolded  */
	config : {
		"rowHeaders" : true
	}
}

module.exports = tableMock;
