/*
    include(arr, obj)

    arr: array of names of all locations
	obj: user input 
	
	Check if the user input is same as any word in the array
	return true is there is (user spell the word correctly)

	example:
	include(['Boulder', 'Denver'], 'Denver') = True
	include(['Boulder', 'Denver'], 'Denvor') = True
*/

function include(arr, obj) {
    for(var i=0; i<arr.length; i++) {
        if (arr[i] == obj) return true;
    }
}

/*
	iterative_lenvenshten(s, t)
	
	s: word 1
	t: word 2

	assume cost of deletes = 1, inserts = 1, subsitutes = 1
	return the edit distance between word 1 and word 2. 

	example:
	iterative_lenvenshten('Boulder', 'Boulder') = 0
	iterative_lenvenshten('Boulder', 'Bouldr') = 1
	iterative_lenvenshten('Boulder', 'boulder') = 1
*/

function iterative_levenshten(s, t){
	  var rows = s.length + 1;
		var cols = t.length + 1;
		var deletes = 1;
		var inserts = 1;
		var subsitutes = 1;
		var dist = [];

		for (var row = 0; row < rows; row++){
			  dist.push([]);
		    for (var col = 0; col < cols; col++){
				    dist[row][col] = 0;
		    }
    }

		for (var row = 1; row < rows; row++){
			  dist[row][0] = row * deletes;
		}

		for (var col = 1; col < cols; col++){
			  dist[0][col] = col * inserts;
		}

		var cost = 0;

		for (var col = 1; col < cols; col++){
			  for (var row = 1; row < rows; row++){
					if (s[row-1] == t[col-1]){
						  cost = 0;
					}
					else{
						  cost = subsitutes;
					}
					dist[row][col] = Math.min(dist[row-1][col] + deletes, dist[row][col-1] + inserts, dist[row-1][col-1] + cost);
				}
		}
		return dist[rows-1][cols-1];
}

/*
	indexOfMin(arr)
	
	arr: array of integers (edit distance)

	return the index of minimal value (distance)

	example:
	indexOfMin([10, 1]) = 1
*/


function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}


/*
	min_dist_word(arr, obj)
	
	arr: array of names of all locations
	obj: user input

	return the closest word

	example:
	min_dist_word(['Boulder', 'Denver'], 'Bouldr') = 'Boulder'
*/

function min_dist_word(arr, obj) {
    if (include(arr, obj)){
        return obj
    }
    var dist_arr = [];
		var len = arr.length
		for (var i = 0; i < len; i++){
        dist_arr.push(iterative_levenshten(obj, arr[i]))
		}
		const indexOfMinValue = arr.indexOf(Math.min(...dist_arr));

		return arr[indexOfMinValue];
}
