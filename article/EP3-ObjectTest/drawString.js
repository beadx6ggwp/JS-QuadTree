function drawString(ctx, text, posX, posY,
	textColor, fontSize, font,
	rotation, align, inline) {
	var lines = text.split("\n");
	if (!rotation) rotation = 0;
	if (!font) font = "'serif'";
	if (!fontSize) fontSize = 16;
	if (!textColor) textColor = '#000000';
	if (!align) align = "start";
	ctx.save();
	ctx.font = fontSize + "px " + font;
	ctx.fillStyle = textColor;
	ctx.textAlign = align;
	posY = inline ? posY : posY + fontSize;
	ctx.translate(posX, posY);
	ctx.rotate(rotation * Math.PI / 180);
	for (i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], 0, i * fontSize);
	}
	ctx.restore();
}