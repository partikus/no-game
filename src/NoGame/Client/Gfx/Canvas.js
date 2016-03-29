'use strict';

import Assert from 'assert-js';
import SpriteMap from './SpriteMap';
import Size from './Size';
import Tile from './../Map/Tile';
import Sprite from './Sprite';

const NICK_FONT = '15px Verdana';
const MESSAGE_FONT_SIZE = 15;
const MESSAGE_FONT = MESSAGE_FONT_SIZE + 'px Verdana';

export default class Canvas
{
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas)
    {
        Assert.instanceOf(canvas, HTMLCanvasElement);

        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        this._visibleTiles = null;
        this._hiddenTiles = null;
        this._debug = false;
    }

    /**
     * @param {int} tilesX
     * @param {int} tilesY
     * @param {int} hiddenTiles
     */
    setVisibleTiles(tilesX, tilesY, hiddenTiles)
    {
        Assert.integer(tilesX);
        Assert.integer(tilesY);
        Assert.integer(hiddenTiles);

        this._visibleTiles = {x: tilesX, y: tilesY};
        this._hiddenTiles = hiddenTiles;
        this._canvas.setAttribute('data-visible-tiles-x', this._visibleTiles.x - this._hiddenTiles * 2);
        this._canvas.setAttribute('data-visible-tiles-y', this._visibleTiles.y - this._hiddenTiles * 2);
    }

    clear()
    {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.beginPath();
    }

    /**
     * @param {int} tileX
     * @param {int} tileY
     * @param {Sprite} sprite
     * @param {Size} offset
     */
    drawTile(tileX, tileY, sprite, offset)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.integer(tileX);
        Assert.integer(tileY);
        Assert.instanceOf(sprite, Sprite);

        let tileSize = this.calculateTileSize();

        this._context.drawImage(
            sprite.img(),
            sprite.offsetX(),
            sprite.offsetY(),
            sprite.width(),
            sprite.height(),
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getHeight()
        );

        if (this._debug) {
            this.debugSmallText(
                `${tileX}:${tileY}`,
                tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() + 8,
                tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() + 8
            );
        }
    }

    /**
     * @param color
     * @param tileX
     * @param tileY
     * @param offset
     */
    drawPointer(color, tileX, tileY, offset)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.integer(tileX);
        Assert.integer(tileY);

        let tileSize = this.calculateTileSize();

        this._context.beginPath();
        this._context.lineWidth = 2;
        this._context.strokeStyle = color;
        this._context.rect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getHeight()
        );
        this._context.stroke();
        this._context.closePath();
    }

    /**
     * @param {int} tileX
     * @param {int} tileY
     * @param {Size} offset
     */
    drawBlankTile(tileX, tileY, offset)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.integer(tileX);
        Assert.integer(tileY);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = '#000000';

        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getHeight(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getWidth()
        );

        if (this._debug) {
            this.debugSmallText(
                `${tileX}:${tileY}`,
                tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() + 8,
                tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() + 8
            );
        }
    }

    /**
     * @param {string} nick
     * @param {int} tileX
     * @param {int} tileY
     */
    drawPlayer(nick, tileX, tileY)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.string(nick);
        Assert.integer(tileX);
        Assert.integer(tileY);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = '#10E052';

        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles),
            tileSize.getHeight() * (tileY - this._hiddenTiles),
            tileSize.getWidth(),
            tileSize.getHeight()
        );

        this.outlineText(
            nick,
            NICK_FONT,
            "#FFFFFF",
            "#000000",
            tileSize.getWidth() * (tileX - this._hiddenTiles) + this._calculateTextTileOffset(nick, NICK_FONT, tileSize),
            tileSize.getHeight() * (tileY - this._hiddenTiles) - 22
        );
    }

    /**
     * @param {int} health
     * @param {int} maxHealth
     * @param {int} tileX
     * @param {int} tileY
     * @param {Size} offset
     */
    drawHealthBar(health, maxHealth, tileX, tileY, offset = new Size(0, 0))
    {
        let percentage = health / maxHealth;
        let tileSize = this.calculateTileSize();
        let color = '#1BE340';

        if (percentage * 100 < 75) {
            color = '#F2E122';
        }
        if (percentage * 100 < 50) {
            color = '#E89117';
        }
        if (percentage * 100 < 35) {
            color = '#F5350A';
        }

        this._context.beginPath();
        this._context.fillStyle = '#000000';
        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() ,
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() - 15,
            tileSize.getWidth(),
            10
        );
        this._context.closePath();


        this._context.beginPath();
        this._context.fillStyle = color;
        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() ,
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() - 15,
            tileSize.getWidth() * percentage,
            10
        );
        this._context.closePath();

        this._context.beginPath();
        this._context.lineWidth = 1;
        this._context.strokeStyle = '#000000';
        this._context.rect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() - 15,
            tileSize.getWidth() * percentage + 1,
            10
        );
        this._context.stroke();
        this._context.closePath();
    }

    /**
     * @param {string} text
     * @param {int} index
     * @param {int} tileX
     * @param {int} tileY
     * @param {Size} offset
     */
    drawCharacterMessage(text, index, tileX, tileY, offset = new Size(0, 0))
    {
        let tileSize = this.calculateTileSize();
        let topOffset = -(index * (MESSAGE_FONT_SIZE + 8));

        this.outlineText(
            text,
            MESSAGE_FONT,
            "#c5bf13",
            "#000000",
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() + this._calculateTextTileOffset(text, MESSAGE_FONT, tileSize),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() - 40 + topOffset
        );
    }

    /**
     * @param {string} nick
     * @param {string} color
     * @param {int} tileX
     * @param {int} tileY
     * @param {Size} offset
     */
    drawCharacter(nick, color, tileX, tileY, offset)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.string(nick);
        Assert.string(color);
        Assert.integer(tileX);
        Assert.integer(tileY);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = color;

        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getHeight()
        );

        if (tileY < (this._visibleTiles.y - this._hiddenTiles)
            && tileX < (this._visibleTiles.x - this._hiddenTiles)
            && tileX > 0) {
            this.outlineText(
                nick,
                NICK_FONT,
                "#FFFFFF",
                "#000000",
                tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() + this._calculateTextTileOffset(nick, NICK_FONT, tileSize),
                tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() - 22
            );
        }

        if (this._debug) {
            this.debugSmallText(
                `${tileX}:${tileY}`,
                tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() + 8,
                tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() + 8
            );
        }
    }

    /**
     * @param {string} text
     * @param {int} pixelX
     * @param {int} pixelY
     */
    debugText(text, pixelX, pixelY)
    {
        this.outlineText(
            text,
            "15px Verdana",
            "#FFFFFF",
            "#000000",
            pixelX,
            pixelY
        )
    }

    /**
     * @param {string} text
     * @param {int} pixelX
     * @param {int} pixelY
     */
    debugSmallText(text, pixelX, pixelY)
    {
        this.outlineText(
            text,
            "8px Verdana",
            "#FFFFFF",
            "#000000",
            pixelX,
            pixelY
        )
    }

    /**
     * @param {string} text
     * @param {string} font
     * @param {string} color
     * @param {string} outlineColor
     * @param {int} pixelX
     * @param {int} pixelY
     */
    outlineText(text, font, color, outlineColor, pixelX, pixelY)
    {
        let outlineSize = 2;

        this._context.font = font;
        this._context.fillStyle = outlineColor;
        this._context.fillText(text, pixelX - outlineSize, pixelY);
        this._context.fillText(text, pixelX,   pixelY - outlineSize);
        this._context.fillText(text, pixelX + outlineSize, pixelY);
        this._context.fillText(text, pixelX,   pixelY + outlineSize);

        this._context.fillStyle = color;
        this._context.fillText(text, pixelX, pixelY);
        this._context.font = font;
    }

    /**
     * @returns {Size}
     */
    calculateTileSize()
    {
        return new Size(
            Math.round(this._canvas.getAttribute('width') / (this._visibleTiles.x - (this._hiddenTiles * 2))),
            Math.round(this._canvas.getAttribute('height') / (this._visibleTiles.y - (this._hiddenTiles * 2)))
        );
    }

    /**
     * @param {string} text
     * @param {string} font
     * @param {Size} tileSize
     * @returns {number}
     * @private
     */
    _calculateTextTileOffset(text, font, tileSize)
    {
        this._context.font = font;
        let textWidth = this._context.measureText(text).width;

        return (Math.round(tileSize.getWidth() / 2) - Math.round(textWidth / 2));
    }

    /**
     * @returns {boolean}
     * @private
     */
    _canDraw()
    {
        return null !== this._visibleTiles;
    }
}