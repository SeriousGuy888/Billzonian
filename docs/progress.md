---
title: Plans
nav_order: 1.5
---

# Plans & Progress

Currently active changes or proposals to change Billzonian.

-----

{% for post in site.categories.plans %}
  <p>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a> <small><em>{{ post.date | date: "%Y-%m-%d" }}</em></small>
    <br>
    <small>{{ post.content | strip_html | truncatewords:50 }}</small>
  </p>
{% endfor %}