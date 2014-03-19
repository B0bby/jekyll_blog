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
            margin-left: -20px;
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
        .profile * {
            font-size: 14px;
        }
        .sidebar {
            float: left;
            width: 200px;
        }
        .sidebar.profile_pic {
            width: 100px;
            height: 160px;
        }
        .sidebar .contact_info {

        }
        li.header {
            font-weight: bold;
            margin-top: 5px;
        }
        .details {
            display: inline-block;
        }
        .details .name {
            font-size: 24px;
            font-weight: bold;
        }
        ul {
            padding-left: 20px;
            list-style-type: none;
        }
        li.course * {
            display: inline-block;
        }
        .course .pre,
        .course .num { 
            font-weight: bold;
            width: 35px; 
        }
        .course .title { }
    </style>

    <div class="staff_records">
        <xsl:apply-templates select="/a:Data/a:Record" />
    </div>

</xsl:template>

<xsl:template match="/a:Data/a:Record">

    <div class="profile">
        <xsl:apply-templates select="a:PCI"/>
    </div>
    
</xsl:template>

<xsl:template match="a:PCI">

    <div class="sidebar">
        <xsl:if test="a:UPLOAD_PHOTO != ''">
            <div class="profile_pic">
                <img src="{concat( 'http://dm.illinoisstate.edu/education/', a:UPLOAD_PHOTO ) }" />
            </div>
        </xsl:if>

        <ul class="contact_info">
            
            <xsl:if test="a:BUILDING != ''">
                <li class="header">OFFICE</li>
                <li><xsl:value-of select="concat( a:BUILDING, ' ', a:ROOMNUM )" /></li>
            </xsl:if>

            <xsl:if test="a:OPHONE3 != ''">
                <li class="header">OFFICE PHONE</li>
                <li><xsl:value-of select="concat( a:OPHONE1, '-', a:OPHONE2, '-', a:OPHONE3 )" /></li>
            </xsl:if>

            <xsl:if test="a:DPHONE3 != ''">
                <li class="header">DEPARTMENT PHONE</li>
                <li><xsl:value-of select="concat( a:DPHONE1, '-', a:DPHONE2, '-', a:DPHONE3 )" /></li>
            </xsl:if>

            <xsl:if test="a:FAX3 != ''">
                <li class="header">FAX</li>
                <li><xsl:value-of select="concat( a:FAX1, '-', a:FAX2, '-', a:FAX3 )" /></li>
            </xsl:if>

            <xsl:if test="a:EMAIL != ''">
                <li class="header">EMAIL</li>
                <li><a href="{a:EMAIL}"><xsl:value-of select="a:EMAIL" /></a></li>
            </xsl:if>

            <xsl:if test="a:MONDAY_START != ''">
                <li class="header">OFFICE HOURS</li>
                <li>Mon <xsl:value-of select="concat(a:MONDAY_START, ' - ', a:MONDAY_END)" /></li>
                <li>Tue <xsl:value-of select="concat(a:TUESDAY_START, ' - ', a:TUESDAY_END)" /></li>
                <li>Wed <xsl:value-of select="concat(a:WEDNESDAY_START, ' - ', a:WEDNESDAY_END)" /></li>
                <li>Thu <xsl:value-of select="concat(a:THURSDAY_START, ' - ', a:THURSDAY_END)" /></li>
                <li>Fri <xsl:value-of select="concat(a:FRIDAY_START, ' - ', a:FRIDAY_END)" /></li>
            </xsl:if>
        </ul>
    </div> <!-- END sidebar -->

    <div class="details">
        <h1 class="name"><xsl:value-of select="concat( a:PREFIX, ' ', a:FNAME, ' ', a:LNAME )" /></h1>

        <ul class="nav nav-tabs">
          <li class="active"><a href="#about" data-toggle="tab">About</a></li>
          <li><a href="#education" data-toggle="tab">Education</a></li>
          <li><a href="#honors" data-toggle="tab">Honors</a></li>
        </ul> <!-- END tabs -->

        <div class="tab-content">
        <div class="tab-pane fade in active" id="about">
            <ul>
                <xsl:if test="a:DESC != ''">
                    <li class="header">RESPONSIBILITIES</li>
                    <li><xsl:value-of select="a:DESC" /></li>
                </xsl:if>

                <xsl:if test="a:BIO != ''">
                    <li class="header">BIOGRAPHY</li>
                    <li><xsl:value-of select="a:BIO" /></li>
                </xsl:if>

                    <li class="header">CURRENT COURSES</li>
                    <xsl:apply-templates select="../a:SCHTEACH" />

                <xsl:if test="a:DESC != ''">
                    <li class="header">RESPONSIBILITIES</li>
                    <li><xsl:value-of select="a:DESC" /></li>
                </xsl:if>

                <xsl:if test="a:TEACHING_INTEREST != ''">
                    <li class="header">TEACHING INTERESTS</li>
                    <xsl:for-each select="a:TEACHING_INTEREST">
                        <li><xsl:value-of select="." /></li>
                    </xsl:for-each>
                </xsl:if>

                <xsl:if test="a:RESEARCH_INTEREST != ''">
                    <li class="header">RESEARCH INTERESTS</li>
                    <xsl:for-each select="a:RESEARCH_INTEREST">
                        <li><xsl:value-of select="." /></li>
                    </xsl:for-each>
                </xsl:if>
            </ul>

        </div>
        <div class="tab-pane fade" id="education">

        </div>
        <div class="tab-pane fade" id="honors">

        </div>
        </div> <!-- END tab-content -->
    </div>

</xsl:template>

<xsl:template match="a:SCHTEACH">

    <xsl:for-each select=".">
        <xsl:if test="a:TITLE != ''">
            <li class="course">
                <span class="pre"><xsl:value-of select="a:COURSEPRE" /></span>
                <span class="num"><xsl:value-of select="a:COURSENUM" /></span>
                <span class="title"><xsl:value-of select="a:TITLE" /></span>
            </li>
        </xsl:if>
    </xsl:for-each>

</xsl:template>

</xsl:stylesheet>