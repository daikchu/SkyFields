function getFF(url) {
	$.ajax({
    url: "/ff" + url,
    type: "POST",
    contentType: "application/json; charset=utf-8",
    async: true,
    success: function (response) {
      const script = document.createElement("SCRIPT");
      script.append(response);
      script.setAttribute("type", "module");
      $("footer").append(script);
    }
  });
}

function getSS(url) {
	$.ajax({
    url: "/ss" + url,
    type: "POST",
    contentType: "application/json; charset=utf-8",
    async: true,
    success: function (response) {
      const node = document.createElement("STYLE");
			node.append(response);
			$("head").append(node);
    }
  });
}