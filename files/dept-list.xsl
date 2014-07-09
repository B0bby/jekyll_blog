<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" indent="yes" encoding="UTF-8"/>

<xsl:param name="dept"></xsl:param>

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
        .staff_records {
            border-top: 1px solid #CCC;
        }
        .staff_records .icon-phone:before {
            font-family: 'isu-icons';
            margin-right: 8px;
            margin-top: 3px;
            font-size: 12px;
            color: #555;
            content: "\e064";
        }
        .staff_records .icon-email:before {
            font-family: 'isu-icons';
            margin-right: 8px;
            margin-top: 5px;
            font-size: 12px;
            color: #555;
            content: "\e053";
        }
        .staff_records .record {
            border: 1px solid #CCC;
            padding: 5px;
            border-top: none;
            display: inline-block;
            width: 310px;
        }
        .staff_records .record_image img {
            float: left;
            width: 100px;
            height: 160px;
            padding: 10px;
        }
        .staff_records .record .name {
            font-weight: bold;
        }
        .staff_records .record .email {
            margin-top: 10px;
        }
        .staff_records .record .dept {
        }
        .staff_records .record .spec {
            font-style: italic;
        }
        .staff_records ul {
            list-style-type: none;
        }
    </style>

    <h2><xsl:value-of select="$dept" /></h2>

    <div class="staff_records">
        <xsl:apply-templates select="/DM/PERSON" />
    </div>

</xsl:template>

<xsl:template match="/DM/PERSON">
    
    <xsl:if test="INFO/DEP!='' and $dept!='' and contains(INFO/DEP, $dept)">
        <div class="record">
            <xsl:if test="UPLOAD_PHOTO != ''">
                <div class="record_image">
                    <img src="{concat( 'http://dm.illinoisstate.edu/education/', UPLOAD_PHOTO ) }" />
                </div>
            </xsl:if>

            <ul class="record_info">
                <li class="name"><xsl:value-of select="concat( FNAME, ' ', LNAME )" /></li>
                <li class="email"><span class="icon-email"></span><a href="mailto:{EMAIL}"><xsl:value-of select="EMAIL" /></a></li>

                <xsl:if test="PHONE != ''">
                    <li class="phone"><span class="icon-phone"></span><span>
                        <xsl:value-of select="PHONE" />
                    </span></li>
                </xsl:if>
            </ul>
        </div>
    </xsl:if>

</xsl:template>

</xsl:stylesheet>