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
            margin-right: 20px
        }
        .sidebar.profile_pic {
            width: 100px;
            height: 160px;
        }
        .sidebar .contact_info {

        }
        li.header {
            margin-bottom: 5px;
            font-weight: bold;
            margin-top: 5px;
            border-bottom: 1px solid #555;
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
        .tab-content {
            width: 600px;
        }
        #research li {
            padding-left: 10px;
            text-indent: -10px;
            margin-bottom: 20px;
            line-height: 18px;
        }
        #research li.header {
            margin-bottom: 5px;
        }
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
          <li><a href="#research" data-toggle="tab">Research</a></li>
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

                    <xsl:if test="../a:SCHTEACH!=''">
                        <li class="header">CURRENT COURSES</li>
                        <xsl:apply-templates select="../a:SCHTEACH" />
                    </xsl:if>

                    <xsl:if test="a:TEACHING_INTERESTS != ''">
                        <li class="header">TEACHING INTERESTS</li>
                        <xsl:for-each select="a:TEACHING_INTERESTS">
                            <li><xsl:value-of select="." /></li>
                        </xsl:for-each>
                    </xsl:if>

                    <xsl:if test="a:RESEARCH_INTERESTS != ''">
                        <li class="header">RESEARCH INTERESTS</li>
                        <xsl:for-each select="a:RESEARCH_INTERESTS">
                            <li><xsl:value-of select="." /></li>
                        </xsl:for-each>
                    </xsl:if>
                </ul>
            </div>
        
            <div class="tab-pane fade" id="education">
                <xsl:choose>
                <xsl:when test="../a:EDUCATION!=''">
                    <xsl:apply-templates select="../a:EDUCATION" />
                </xsl:when>
                <xsl:otherwise>
                    <ul><li><em>Nothing seems to be here.</em></li></ul>
                </xsl:otherwise>
                </xsl:choose>
            </div>

            <div class="tab-pane fade" id="research">

                <xsl:if test="../a:INTELLCONT!=''" ><ul>
                    <li class="header">JOURNALS</li>
                    <xsl:apply-templates select="../a:INTELLCONT" />
                </ul></xsl:if>
                <xsl:if test="../a:PRESENT!=''" ><ul>
                    <li class="header">PRESENTATIONS</li>
                    <xsl:apply-templates select="../a:PRESENT" />
                </ul></xsl:if>
                <xsl:if test="../a:CONGRANT!=''" ><ul>
                    <li class="header">GRANTS</li>
                    <xsl:apply-templates select="../a:CONGRANT" />
                </ul></xsl:if>
            </div>
        </div> <!-- END tab-content -->
    </div>

</xsl:template>


<!-- TEACHING SCHEDULE -->
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


<!-- EDUCATION HISTORY -->
<xsl:template match="a:EDUCATION">

    <xsl:for-each select=".">
        <ul>
            <li class="header">
                <xsl:if test="a:DEG!=''"><xsl:value-of select="a:DEG" /></xsl:if>
                <xsl:if test="a:MAJOR!=''"><xsl:value-of select="concat( ' ', a:MAJOR )" /></xsl:if>
                <xsl:if test="a:SUPPAREA!=''"><xsl:value-of select="concat( ' / ', a:SUPPAREA )" /></xsl:if>
            </li>
            <li><xsl:value-of select="a:SCHOOL" /></li>
            <li><xsl:value-of select="a:LOCATION" /></li>
        </ul>
    </xsl:for-each>

</xsl:template>


<!-- JOURNALS / ARTICLES -->
<xsl:template match="a:INTELLCONT">

    <xsl:for-each select=".">
        
        <li>
            <xsl:for-each select="a:INTELLCONT_AUTH">
                <xsl:if test="a:LNAME!=''"><xsl:value-of select="a:LNAME" /></xsl:if>
                <xsl:if test="a:FNAME!=''"><xsl:value-of select="concat( ', ', substring( a:FNAME, 1, 1 ), '. ')" /></xsl:if>
            </xsl:for-each>
            <xsl:if test="a:TITLE!=''"><xsl:value-of select="a:TITLE" /></xsl:if>
            <xsl:if test="a:PUBLISHER!=''"><em><xsl:value-of select="concat( ', ', a:PUBLISHER )" />.</em></xsl:if>
            <xsl:if test="a:VOLUME!=''"> Vol. <xsl:value-of select="a:VOLUME" /></xsl:if>
            <xsl:if test="a:ISSUE!=''"> ( <xsl:value-of select="a:ISSUE" /> )</xsl:if>
            <xsl:if test="a:PAGENUM!=''"> pp. <xsl:value-of select="a:PAGENUM" /></xsl:if>
        </li>
        
    </xsl:for-each>

</xsl:template>


<!-- PRESENTATIONS -->
<xsl:template match="a:PRESENT">

    <xsl:for-each select=".">
        
        <li>
            <xsl:for-each select="a:PRESENT_AUTH">
                <xsl:if test="a:LNAME!=''"><xsl:value-of select="a:LNAME" /></xsl:if>
                <xsl:if test="a:FNAME!=''"><xsl:value-of select="concat( ', ', substring( a:FNAME, 1, 1 ), '. ')" /></xsl:if>
            </xsl:for-each>
            <xsl:if test="a:DATE_START!=''"> ( <xsl:value-of select="a:DATE_START" /> ). </xsl:if>
            <xsl:if test="a:TITLE!=''"><xsl:value-of select="a:TITLE" />. </xsl:if>
            <xsl:if test="a:NAME!=''"> Presented at the <xsl:value-of select="a:NAME" />. </xsl:if>
            <xsl:if test="a:LOCATION!=''">, <xsl:value-of select="a:LOCATION" /></xsl:if>
        </li>
        
    </xsl:for-each>

</xsl:template>


<!-- AWARDED GRANTS AND CONTRACTS -->
<xsl:template match="a:CONGRANT">

    <xsl:for-each select=".">
        
        <li>
            <xsl:for-each select="a:CONGRANT_INVEST">
                <xsl:if test="a:LNAME!=''"><xsl:value-of select="a:LNAME" /></xsl:if>
                <xsl:if test="a:FNAME!=''"><xsl:value-of select="concat( ', ', substring( a:FNAME, 1, 1 ), '. ')" /></xsl:if>
            </xsl:for-each>
            <xsl:if test="a:DTY_START!=''"><xsl:value-of select="concat( '(', a:DTY_START, '). ' )" /></xsl:if>
            <xsl:if test="a:TITLE!=''"><xsl:value-of select="a:TITLE" /></xsl:if>
            <xsl:if test="a:SPONORG!=''"><em><xsl:value-of select="concat( ', ', a:SPONORG )" /></em></xsl:if>
            <xsl:if test="a:AMOUNT!=''"> Award amount: $<xsl:value-of select="a:AMOUNT" /></xsl:if>
        </li>
        
    </xsl:for-each>

</xsl:template>




</xsl:stylesheet>