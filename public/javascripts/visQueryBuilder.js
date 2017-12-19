/**
 * Created by luoyuyu on 2017/12/17.
 */
/////////Visualization Query Builder////////////////
$("#visQueryBuilder").click(function () {
    $('#visQueryModal').modal({backdrop: 'static', keyboard: false}, 'show');
});

$("#addVisQuery").click(function () {
    let html = `<tr id = ${$("#queryTableBody tr").length}>
  <td>
    <select class="visualize form-control">
      <option>bar</option>
      <option>line</option>
      <option>pie</option>
      <option>scatter</option>
    </select>
  </td>
  <td>
    <select class="selectX form-control">
      <option>date</option>
      <option>carrier</option>
      <option>dep_delay</option>
      <option>arr_delay</option>
    </select>
  </td>
  <td>
    <select class="selectY form-control">
      <option>passenger</option>
      <option>carrier</option>
      <option>dep_delay</option>
      <option>arr_delay</option>
    </select>
  </td>
  <td>
    <select class="from form-control">
      <option>#{selectedData}</option>
    </select>
  </td>
  <td>
    <select class="group_bin form-control">
      <option>Group by</option>
      <option>Bin by</option>
    </select>
    <select class="byWhat form-control">
      <option>date</option>
      <option>carrier</option>
      <option>dep_delay</option>
      <option>arr_delay</option>
    </select>
  </td>
  <td>
    <select class="agg form-control">
      <option>Sum(&nbsp;)</option>
      <option>Avg(&nbsp;)</option>
      <option>Count(&nbsp;)</option>
    </select>
  </td>
  <td>
    <select class="order form-control">
      <option>date</option>
      <option>carrier</option>
      <option>dep_delay</option>
      <option>arr_delay</option>
    </select>
  </td>
</tr>`;
    $("#queryTableBody").append(html);
});

$("#subVisQuery").click(function () {
    $("tr[id = '"+($("#queryTableBody tr").length - 1)+"']").remove();
});
$("#visQueryStartBtn").click(function () {
    alert("send vis query")
});