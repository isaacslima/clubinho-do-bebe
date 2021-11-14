class utils {
	static newGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
	static retornaUrlImagem(foto) {
		return `https://firebasestorage.googleapis.com/v0/b/clubinhodobebe-cd995.appspot.com/o/produtos%2F${foto}?alt=media`;
	}
}

export default utils
