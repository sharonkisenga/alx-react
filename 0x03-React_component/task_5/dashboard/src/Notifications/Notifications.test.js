import React from 'react';
import { jest } from '@jest/globals';
import { shallow, mount } from 'enzyme';
import Notifications from './Notifications';
import { getLatestNotification } from '../utils/utils';

describe("Testing the <Notifications /> Component", () => {
  
  let wrapper;
  const listNotifications = [
    {id: 1, value: "New course available", type: "default"},
    {id: 2, value: "New resume available", type: "urgent"},
    {id: 3, html: {__html: getLatestNotification()}, type: "urgent"},
  ];

  beforeEach(() => {
    wrapper = shallow(<Notifications />);
  });

  it("<Notification is rendered without crashing", () => {
    expect(wrapper).toBeDefined();
  });

  it("<renders NotificationItems", () => {
    wrapper = shallow(<Notifications displayDrawer={true}/>);
    expect(wrapper.find('NotificationItem')).not.toHaveLength(0);
  });

  it("Here is the list of notifications'", () => {
    wrapper.setProps({displayDrawer: true, listNotifications: [{id: 1, value: "New course available", type: "default"}]});
    expect(wrapper.contains(<p>Here is the list of notifications</p>)).toEqual(true);
  });

  it("verify that the first NotificationItem element", () => {
    wrapper = shallow(<Notifications displayDrawer={true}/>);
    expect(wrapper.find("NotificationItem").first().html()).toEqual('<li data-notification-type=\"default\">No new notification for now</li>');
  });

  it("verify that Notifications renders correctly if you dont pass the listNotifications property or if you pass an empty array", () => {
    wrapper = shallow(<Notifications displayDrawer={true}/>);
    expect(wrapper.find("NotificationItem").first().html()).toEqual('<li data-notification-type=\"default\">No new notification for now</li>');
    wrapper.setProps({displayDrawer: true, listNotifications: []});
    expect(wrapper.find("NotificationItem").first().html()).toEqual('<li data-notification-type=\"default\">No new notification for now</li>');
  });

  it(" the message Here is the list of notifications is not displayed", () => {
    wrapper = shallow(<Notifications displayDrawer={true} listNotifications={[]}/>);
    expect(wrapper.find("NotificationItem").first().html()).toEqual('<li data-notification-type=\"default\">No new notification for now</li>');
    expect(wrapper.findWhere((node)=>{return node.text() === "Here is the list of notifications"})).toHaveLength(0);
  });

  it("menu item is displayed when displayDrawer is false", () => {
    expect(wrapper.find('.menuItem')).toHaveLength(1);
  });

  it("div.Notifications is  displayed when displayDrawer is false", () => {
    expect(wrapper.find('.Notifications')).toHaveLength(0);
  });
});

describe("Testing <Notification displayDrawer={true}/> ", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Notifications displayDrawer={true}/>);
  });

  it("menu item is being displayed when displayDrawer is true", () => {
    expect(wrapper.find('.menuItem')).toHaveLength(1);
  });

  it("div.Notifications is displayed when displayDrawer is true", () => {
    expect(wrapper.find('.Notifications')).toHaveLength(1);
  });
});

describe("Testing <Notification displayDrawer={true} listNotifications={[...]}/> ", () => {
  let wrapper;
  const listNotifications = [
    {id: 1, value: "New course available", type: "default"},
    {id: 2, value: "New resume available", type: "urgent"},
    {id: 3, html: {__html: getLatestNotification()}, type: "urgent"},
  ];

  beforeEach(() => {
    wrapper = shallow(<Notifications displayDrawer={true} listNotifications={listNotifications}/>);
  });

  it("the component renders it correctly and with the right number of NotificationItem", () => {
    expect(wrapper.find("NotificationItem")).toHaveLength(3);
    expect(wrapper.find("NotificationItem").first().props().value).toEqual('New course available');
  });
});

describe("the notification class Component", () => {
  it("the function markAsRead on an instance of the component", () => {
    const listNotifications = [
      {id: 1, value: "New course available", type: "default"},
      {id: 2, value: "New resume available", type: "urgent"},
      {id: 3, html: {__html: getLatestNotification()}, type: "urgent"},
    ];
    console.log = jest.fn();
    const wrapper = mount(<Notifications displayDrawer={true} listNotifications={listNotifications}/>);
    const mock = jest.spyOn(console, 'log');
    const noti = wrapper.find('li').first();
    noti.simulate('click');
    expect(mock).toBeCalledWith("Notification 1 has been marked as read");
    mock.mockRestore();
    jest.restoreAllMocks();
  });
});

describe("class Component re-rendering", () => {
  it("the props of the component with the same list, the component doesnt rerender", () => {
    const listNotifications = [
      {id: 1, value: "New course available", type: "default"},
      {id: 2, value: "New resume available", type: "urgent"},
      {id: 3, html: {__html: getLatestNotification()}, type: "urgent"},
    ];
    const listNotifications2 = [
      {id: 1, value: "New course available changed", type: "default"},
      {id: 2, value: "New resume available", type: "urgent"},
      {id: 3, html: {__html: getLatestNotification()}, type: "urgent"},
    ];
    console.log = jest.fn();
    const wrapper = shallow(<Notifications displayDrawer={true} listNotifications={listNotifications}/>);
    wrapper.setProps({listNotifications: listNotifications});
    expect(wrapper.find('NotificationItem').length).toBe(3);
    expect(wrapper.find('NotificationItem').first().props().value).toEqual("New course available");
  });

  it("the component with a longer list, the component does rerender", () => {
    const listNotifications = [
      {id: 1, value: "New course available", type: "default"},
      {id: 2, value: "New resume available", type: "urgent"},
      {id: 3, html: {__html: getLatestNotification()}, type: "urgent"},
    ];
    const listNotifications2 = [
      {id: 1, value: "New course available", type: "default"},
      {id: 2, value: "New course available2", type: "default"},
      {id: 3, value: "New resume available", type: "urgent"},
      {id: 4, html: {__html: getLatestNotification()}, type: "urgent"},
    ];
    console.log = jest.fn();
    const wrapper = shallow(<Notifications displayDrawer={true} listNotifications={listNotifications}/>);
    wrapper.setProps({listNotifications: listNotifications2});
    expect(wrapper.find("NotificationItem").at(1).props().value).toEqual("New course available2");
    expect(wrapper.find("NotificationItem").length).toBe(4);
  });
});
