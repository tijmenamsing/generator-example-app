# <%= appname %>

App type: <%= type %>

App version: <%= version %>

<%_ if (type !== 'angular') { _%>
You do not use Angular because: <%= why %>
<%_ } _%>
