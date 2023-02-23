module.exports = {
    /*KHU VỰC PHÂN TRANG JAVASCRIPT*/
    page: {items: [], rowCount: 0, numberPerPage: '10', pageNumber: 1, pageList: [], pageCount: 0},
    /*load tong trang va danh sach trang*/
    getPageCount: function (pageResult) {
        var pageCount = Math.ceil(pageResult.rowCount / Number(pageResult.numberPerPage));
        return pageCount;
    },
    /*TRợ giúp tính toán số trang hiển thị khi hiện page*/
    getPageList: function (pagingResult) {
        console.log('get page list');
        var pages = [];
        var from = pagingResult.pageNumber - 3;
        var to = pagingResult.pageNumber + 5;
        if (from < 0) {
            to -= from;
            from = 1;
        }

        if (from < 1) {
            from = 1;
        }

        if (to > pagingResult.pageCount) {
            to = pagingResult.pageCount;
        }

        for (var i = from; i <= to; i++) {
            pages.push(i);
        }
        console.log('page list = ',pages);
        return pages;
    }

};