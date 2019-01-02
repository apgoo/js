export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLikes(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        }

        // presetes data from local storage
        this.persistData();

        this.likes.push(like);
        return like;
    };

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id)
        this.likes.splice(index, 1);

                // presetes data from local storage
                this.persistData();
    }

    isLike(id) {
        return this.likes.findIndex(el => el.id === id) !== -1
    }

    getNumlike() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorag() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        if(storage) this.likes = storage;
    }

}