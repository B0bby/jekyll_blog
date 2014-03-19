<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                              xmlns:a="http://www.digitalmeasures.com/schema/data"
                              xmlns:d="http://www.digitalmeasures.com/schema/data-metadata">

<xsl:template match="*">

    <style>

        @font-face {
          font-family: 'isu-icons';
          src:  url('//iguides.illinoisstate.edu/cdn/fonts/isu-icons.eot');
          src:  url('//iguides.illinoisstate.edu/cdn/fonts/isu-icons.eot?#iefix') format('embedded-opentype'),
                url('//iguides.illinoisstate.edu/cdn/fonts/isu-icons.svg#icomoon') format('svg'),
                url('//iguides.illinoisstate.edu/cdn/fonts/isu-icons.woff') format('woff'),
                url('//iguides.illinoisstate.edu/cdn/fonts/isu-icons.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        .icon-phone:before {
            font-family: 'isu-icons';
            float: left;
            margin-right: 8px;
            margin-top: 3px;
            font-size: 12px;
            color: #555;
            content: "\e064";
        }
        .icon-email:before {
            font-family: 'isu-icons';
            float: left;
            margin-right: 8px;
            margin-top: 5px;
            font-size: 12px;
            color: #555;
            content: "\e053";
        }
        .staff_records {
            border-top: 1px solid #CCC;
        }
        .record {
            border: 1px solid #CCC;
            padding: 5px;
            border-top: none;
            display: inline-block;
            width: 310px;
        }
        .record_image img {
            float: left;
            width: 100px;
            height: 160px;
            padding: 10px;
        }
        .record .name {
            font-weight: bold;
        }
        .record .email {
            margin-top: 10px;
        }
        .record .dept {
        }
        .record .spec {
            font-style: italic;
        }
        ul {
            list-style-type: none;
        }
    </style>

    <div class="staff_records">
        <xsl:apply-templates select="/a:Data/a:Record" />
    </div>

</xsl:template>

<xsl:template match="/a:Data/a:Record">

    <div class="record">
        <xsl:apply-templates select="a:PCI"/>
    </div>
    
</xsl:template>

<xsl:template match="a:PCI">

    <xsl:if test="a:UPLOAD_PHOTO != ''">
        <div class="record_image">
            <img src="{concat( 'http://dm.illinoisstate.edu/education/', a:UPLOAD_PHOTO ) }" />
        </div>
    </xsl:if>

    <ul class="record_info">
        <li class="name"><xsl:value-of select="concat( a:FNAME, ' ', a:LNAME )" /></li>

        <xsl:apply-templates select="(../a:ADMIN/a:ADMIN_DEP)[1]" />

        <li class="email"><span class="icon-email"></span><a href="mailto:{a:EMAIL}"><xsl:value-of select="a:EMAIL" /></a></li>

        <xsl:if test="a:OPHONE3 != ''">
            <li class="phone"><span class="icon-phone"></span><div>
                <xsl:value-of select="concat( a:OPHONE1, '-', a:OPHONE2, '-', a:OPHONE3 )" />
            </div></li>
        </xsl:if>
    </ul>

</xsl:template>

<xsl:template match="a:Record/a:ADMIN/a:ADMIN_DEP">

        <li class="dept"><xsl:value-of select="a:DEP" /></li>
        <li class="spec"><xsl:value-of select="a:SPEC_AREA" /></li>

</xsl:template>

</xsl:stylesheet>